import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl, { Map } from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import type { ReactNode } from 'react'
import { MOCK_ROUTES, ALL_STOPS, type MockRoute } from '../../../data/mockRoutes'
import BusMarker from '../components/BusMarker'
import MarkerIcon from '../components/MarkerIcon'

type ShuttleMapProps = {
  className?: string
  showStopMarkers?: boolean
  focusOnBus?: boolean
  focusBusId?: string       // pin camera to a specific bus id (reactive — changes trigger flyTo)
  focusZoom?: number        // zoom level when following a bus (default 17.5)
  visibleBusIds?: string[]  // if set, only these buses get markers
  routeCoords?: [number, number][]  // [lng, lat] pairs
  routeColor?: string       // color for the route line (default #4285F4)
  skipRouteFitBounds?: boolean
  initialCenter?: [number, number]
  initialZoom?: number
  zoomOutOnReveal?: boolean // zoom out to show all buses when the app preview reveals (~16.8 s)
  focusDelayMs?: number     // ms before camera starts tracking focusBusId (default 1200)
  onFocusBusDist?: (dist: number, totalDist: number) => void // fires every frame for the focused bus
  busRoutes?: MockRoute[]   // if provided, replaces MOCK_ROUTES for this map instance
  flyToCoord?: [number, number]  // [lng, lat] — animates map to this position when changed
  flyToZoom?: number             // zoom level for flyTo (default 16.5)
  flyToOffset?: [number, number] // pixel offset [x, y] from map center (negative y = shift up)
  dropPoints?: [number, number][]  // [lng, lat] pairs — rendered as coloured drop-point pins
  dropPointIcons?: (ReactNode | null)[]  // custom icon per drop point index; null falls back to default
  riderPath?: [number, number][]   // path to animate a rider marker along (loops continuously)
  riderIcon?: ReactNode            // icon to render at the animated rider position
  riderDurationMs?: number         // total loop duration in ms (default 12000)
  followRider?: boolean            // keep camera centered on animated rider
  riderFollowZoom?: number         // zoom used while following rider
  riderFollowPitch?: number        // pitch used while following rider
  riderFollowBearing?: boolean     // rotate map with rider heading
}

const MAP_CENTER: [number, number] = [-1.571, 6.674]
const MAP_ZOOM = 15.4
const FOCUS_ZOOM = 17.5

// ─── Helpers ──────────────────────────────────────────────────────────────────

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function calcHeading(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = lat2 - lat1
  const dLng = lng2 - lng1
  return (Math.atan2(dLng, dLat) * (180 / Math.PI) + 360) % 360
}

let _busIdCounter = 0

// ─── Stop-dwell helpers ───────────────────────────────────────────────────────

const DWELL_MS       = 5_000   // ms to pause at each bus stop
const STOP_THRESHOLD = 0.0006  // degree-units (~60 m) — matches a waypoint to a named stop

/** Returns sorted cumulative-distance values where this route passes a named stop. */
function findStopDists(
  path: [number, number][],
  cumDists: number[],
  stops: { lat: number; lng: number }[]
): number[] {
  const dists: number[] = []
  for (const stop of stops) {
    let minD = Infinity
    let minCum = 0
    for (let i = 0; i < path.length; i++) {
      const cosLat = Math.cos(path[i][1] * Math.PI / 180)
      const dx = (path[i][0] - stop.lng) * cosLat
      const dy = path[i][1] - stop.lat
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < minD) { minD = d; minCum = cumDists[i] }
    }
    if (minD <= STOP_THRESHOLD) dists.push(minCum)
  }
  // deduplicate nearby matches and sort by position along route
  const unique: number[] = []
  for (const d of dists.sort((a, b) => a - b)) {
    if (!unique.length || d - unique[unique.length - 1] > STOP_THRESHOLD * 0.5) unique.push(d)
  }
  return unique
}

/**
 * Maps elapsed route-time → distance along path, inserting DWELL_MS pauses
 * wherever the route passes a stop.
 * `travelMs` is the pure travel time (no dwells); the effective loop length is
 *  travelMs + stopDists.length * DWELL_MS.
 */
function getDistAt(
  elapsed: number,
  stopDists: number[],
  totalDist: number,
  travelMs: number
): number {
  let dwellAccum = 0
  for (const stopDist of stopDists) {
    const arriveTime = (stopDist / totalDist) * travelMs + dwellAccum
    const deptTime   = arriveTime + DWELL_MS
    if (elapsed < arriveTime) break              // haven't reached this stop yet
    if (elapsed < deptTime)   return stopDist   // dwelling at this stop
    dwellAccum += DWELL_MS                       // already left this stop
  }
  const travelElapsed = elapsed - dwellAccum
  return Math.min((travelElapsed / travelMs) * totalDist, totalDist)
}


// ─── Component ────────────────────────────────────────────────────────────────

export default function ShuttleMap({
  className,
  showStopMarkers = true,
  focusOnBus,
  focusBusId: focusBusIdProp,
  focusZoom: focusZoomProp,
  visibleBusIds,
  routeCoords,
  routeColor = '#4285F4',
  skipRouteFitBounds,
  initialCenter,
  initialZoom,
  zoomOutOnReveal,
  focusDelayMs,
  busRoutes,
  flyToCoord,
  flyToZoom,
  flyToOffset,
  dropPoints,
  dropPointIcons,
  riderPath,
  riderIcon,
  riderDurationMs = 12000,
  followRider = false,
  riderFollowZoom = 16.4,
  riderFollowPitch = 48,
  riderFollowBearing = false,
}: ShuttleMapProps) {
  const routes = busRoutes ?? MOCK_ROUTES
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const dropPointMarkersRef = useRef<mapboxgl.Marker[]>([])
  const dropPointRootsRef = useRef<ReturnType<typeof createRoot>[]>([])
  const riderMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const riderRootRef = useRef<Root | null>(null)
  const riderFrameRef = useRef<number>(0)
  const [missingToken, setMissingToken] = useState(false)

  // Refs so the tick loop can read current prop values without re-mounting
  const focusBusIdRef   = useRef<string | null>(focusBusIdProp ?? null)
  const focusFlownInRef = useRef(false)
  const flyToActiveRef  = useRef(false)   // true while the initial fly-in is animating
  const focusDelayMsRef = useRef(focusDelayMs ?? 1200)
  const focusZoomRef    = useRef(focusZoomProp ?? FOCUS_ZOOM)
  const zoomOutDoneRef  = useRef(false)

  // Keep refs in sync with incoming props
  useEffect(() => {
    const next = focusBusIdProp ?? null
    if (next !== focusBusIdRef.current) {
      focusBusIdRef.current   = next
      focusFlownInRef.current = false   // re-trigger flyTo when bus target changes
      flyToActiveRef.current  = false
    }
  }, [focusBusIdProp])

  useEffect(() => {
    focusDelayMsRef.current = focusDelayMs ?? 1200
  }, [focusDelayMs])

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined

    if (!token) {
      console.warn('VITE_MAPBOX_TOKEN is missing. Mapbox map will not render.')
      setMissingToken(true)
      return
    }

    mapboxgl.accessToken = token

    if (!containerRef.current || mapRef.current) return

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: initialCenter ?? MAP_CENTER,
      zoom: initialZoom ?? MAP_ZOOM,
      interactive: false,
      attributionControl: false,
      logoPosition: 'bottom-right',
    })

    mapRef.current.on('error', (event) => {
      console.error('Mapbox GL error:', event.error)
    })

    mapRef.current.on('load', () => {
      mapRef.current?.resize()
    })

    requestAnimationFrame(() => {
      mapRef.current?.resize()
    })
    setTimeout(() => {
      mapRef.current?.resize()
    }, 50)

    // ── Cumulative distance helper (geographic, in degrees — proportional to metres) ──
    function buildCumDists(path: [number, number][]): number[] {
      const d = [0]
      for (let i = 0; i < path.length - 1; i++) {
        const cosLat = Math.cos(path[i][1] * Math.PI / 180)
        const dlng = (path[i + 1][0] - path[i][0]) * cosLat
        const dlat = path[i + 1][1] - path[i][1]
        d.push(d[i] + Math.sqrt(dlng * dlng + dlat * dlat))
      }
      return d
    }

    // ── Bus animation + camera follow ────────────────────────────────────────
    const LOOP_MS = 48_000
    const APP_REVEAL_START_MS = LOOP_MS * 0.35   // ~16 800 ms — matches CSS appReveal keyframe
    const PAN_DURATION_MS = 10_000
    const PAN_END_MS = APP_REVEAL_START_MS + PAN_DURATION_MS
    const timelineStart = performance.now()
    let activeRouteId: string | null = null
    let lastCycleIndex = -1

    // Stop markers
    const stopMarkers = showStopMarkers ? ALL_STOPS.map(s => {
      const el = document.createElement('div')
      el.style.cssText =
        'width:7px;height:7px;border-radius:50%;background:white;border:2px solid #888;box-shadow:0 1px 3px rgba(0,0,0,0.2);'
      return new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([s.lng, s.lat])
        .addTo(mapRef.current!)
    }) : []

    // ── Pre-compute per-route distance data & place initial markers ───────────
    const busMarkers: Record<string, mapboxgl.Marker> = {}
    const busRoots: Record<string, Root> = {}
    const busPositions: Record<string, { lng: number; lat: number }> = {}
    const busHeadings: Record<string, number> = {}
    const routeAnimData: Record<string, {
      routeStartTime: number
      cumDists: number[]
      totalDist: number
      stopDists: number[]
      effectiveTotalMs: number
    }> = {}
    const now = performance.now()

    for (const route of routes) {
      if (!route.path || route.path.length < 2) continue

      const cumDists        = buildCumDists(route.path)
      const totalDist       = cumDists[cumDists.length - 1]
      const stopDists       = findStopDists(route.path, cumDists, ALL_STOPS)
      const effectiveTotalMs = route.totalMs + stopDists.length * DWELL_MS
      const routeStartTime  = now - route.startFraction * effectiveTotalMs

      // Resolve initial position using dwell-aware distance mapping
      const initElapsed = route.startFraction * effectiveTotalMs
      const initDist    = getDistAt(initElapsed, stopDists, totalDist, route.totalMs)
      let initSeg = 0
      while (initSeg < cumDists.length - 2 && cumDists[initSeg + 1] <= initDist) initSeg++
      const initSegLen = cumDists[initSeg + 1] - cumDists[initSeg]
      const initT = initSegLen > 0 ? (initDist - cumDists[initSeg]) / initSegLen : 0
      const initFrom = route.path[initSeg]
      const initTo   = route.path[initSeg + 1]
      const initLng  = initFrom[0] + (initTo[0] - initFrom[0]) * initT
      const initLat  = initFrom[1] + (initTo[1] - initFrom[1]) * initT
      const initHeading = calcHeading(initFrom[1], initFrom[0], initTo[1], initTo[0])

      if (visibleBusIds && !visibleBusIds.includes(route.id)) {
        busPositions[route.id] = { lng: initLng, lat: initLat }
        routeAnimData[route.id] = { routeStartTime, cumDists, totalDist, stopDists, effectiveTotalMs }
        continue
      }

      _busIdCounter++
      const el = document.createElement('div')
      const root = createRoot(el)
      root.render(<BusMarker heading={initHeading} />)

      busMarkers[route.id] = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([initLng, initLat])
        .addTo(mapRef.current!)
      busRoots[route.id] = root
      busPositions[route.id] = { lng: initLng, lat: initLat }
      busHeadings[route.id] = initHeading
      routeAnimData[route.id] = { routeStartTime, cumDists, totalDist, stopDists, effectiveTotalMs }
    }

    let raf: number
    const tick = (timestamp: number) => {
      if (!mapRef.current) return
      const elapsed = timestamp - timelineStart
      const cycleIndex = Math.floor(elapsed / LOOP_MS)
      const cycleTime = elapsed % LOOP_MS

      if (cycleIndex !== lastCycleIndex) {
        lastCycleIndex = cycleIndex
        if (!focusOnBus) {
          const route = routes[Math.floor(Math.random() * routes.length)]
          activeRouteId = route?.id ?? null
          mapRef.current.jumpTo({ center: MAP_CENTER, zoom: MAP_ZOOM })
        }
      }

      for (const route of routes) {
        const marker = busMarkers[route.id]
        const root = busRoots[route.id]
        const animData = routeAnimData[route.id]
        if (!marker || !root || !animData) continue

        const { routeStartTime, cumDists, totalDist, stopDists, effectiveTotalMs } = animData
        const routeElapsed = ((timestamp - routeStartTime) % effectiveTotalMs + effectiveTotalMs) % effectiveTotalMs
        const targetDist   = getDistAt(routeElapsed, stopDists, totalDist, route.totalMs)

        let seg = 0
        while (seg < cumDists.length - 2 && cumDists[seg + 1] <= targetDist) seg++
        const segLen = cumDists[seg + 1] - cumDists[seg]
        const t = segLen > 0 ? (targetDist - cumDists[seg]) / segLen : 0

        const from = route.path[seg]
        const to   = route.path[seg + 1]
        const lng  = from[0] + (to[0] - from[0]) * t
        const lat  = from[1] + (to[1] - from[1]) * t
        marker.setLngLat([lng, lat])
        busPositions[route.id] = { lng, lat }

        const newHeading = calcHeading(from[1], from[0], to[1], to[0])
        const delta = Math.abs(((newHeading - busHeadings[route.id] + 180) % 360) - 180)
        if (delta > 5) {
          root.render(<BusMarker heading={newHeading} />)
          busHeadings[route.id] = newHeading
        }
      }

      // ── Zoom-out to show all buses after the app reveal (~16.8 s) ──────────
      if (zoomOutOnReveal && !zoomOutDoneRef.current && cycleTime >= APP_REVEAL_START_MS) {
        zoomOutDoneRef.current = true
        const positions = Object.values(busPositions)
        if (positions.length > 0 && mapRef.current) {
          const bounds = positions.reduce(
            (b, p) => b.extend([p.lng, p.lat] as [number, number]),
            new mapboxgl.LngLatBounds(
              [positions[0].lng, positions[0].lat],
              [positions[0].lng, positions[0].lat]
            )
          )
          mapRef.current.fitBounds(bounds, {
            padding: 70,
            duration: 2200,
            maxZoom: 14.5,
            easing: easeInOut,
          })
        }
      }

      // ── Camera follow for a focused bus ─────────────────────────────────────
      const currentFocusBusId = focusBusIdRef.current
      if (currentFocusBusId && elapsed >= focusDelayMsRef.current) {
        const target = busPositions[currentFocusBusId]
        if (target) {
          if (!focusFlownInRef.current) {
            // First time: dramatic fly-in zoom
            focusFlownInRef.current = true
            flyToActiveRef.current  = true
            mapRef.current.flyTo({
              center: [target.lng, target.lat],
              zoom: focusZoomRef.current,
              duration: 2000,
              easing: easeInOut,
            })
            mapRef.current.once('moveend', () => {
              flyToActiveRef.current = false
            })
          } else if (!flyToActiveRef.current) {
            // Fly-in complete — pin map center exactly to the bus every frame
            mapRef.current.setCenter([target.lng, target.lat])
          }
        }
      } else if (
        !focusOnBus &&
        !currentFocusBusId &&
        activeRouteId &&
        cycleTime >= APP_REVEAL_START_MS &&
        cycleTime <= PAN_END_MS
      ) {
        const target = busPositions[activeRouteId]
        if (target) {
          mapRef.current.easeTo({
            center: [target.lng, target.lat],
            duration: 600,
            easing: easeInOut,
          })
        }
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      stopMarkers.forEach(m => m.remove())
      Object.values(busMarkers).forEach(m => m.remove())
      Object.values(busRoots).forEach(root => root.unmount())
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [showStopMarkers])

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(() => {
      mapRef.current?.resize()
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !routeCoords || routeCoords.length < 2) return

    const draw = () => {
      if (map.getLayer('route-line')) map.removeLayer('route-line')
      if (map.getLayer('route-start')) map.removeLayer('route-start')
      if (map.getLayer('route-end')) map.removeLayer('route-end')
      if (map.getSource('route')) map.removeSource('route')
      if (map.getSource('route-endpoints')) map.removeSource('route-endpoints')

      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: routeCoords },
        },
      })

      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': routeColor, 'line-width': 4, 'line-opacity': 0.85 },
      })

      map.addSource('route-endpoints', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            { type: 'Feature', properties: { role: 'start' }, geometry: { type: 'Point', coordinates: routeCoords[0] } },
            { type: 'Feature', properties: { role: 'end' }, geometry: { type: 'Point', coordinates: routeCoords[routeCoords.length - 1] } },
          ],
        },
      })

      map.addLayer({
        id: 'route-start',
        type: 'circle',
        source: 'route-endpoints',
        filter: ['==', ['get', 'role'], 'start'],
        paint: { 'circle-radius': 7, 'circle-color': routeColor, 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' },
      })

      map.addLayer({
        id: 'route-end',
        type: 'circle',
        source: 'route-endpoints',
        filter: ['==', ['get', 'role'], 'end'],
        paint: { 'circle-radius': 7, 'circle-color': '#111', 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' },
      })

      if (!skipRouteFitBounds) {
        const bounds = routeCoords.reduce(
          (b, c) => b.extend(c as [number, number]),
          new mapboxgl.LngLatBounds(routeCoords[0], routeCoords[0])
        )
        map.fitBounds(bounds, { padding: 60, duration: 1200, easing: easeInOut })
      }
    }

    if (map.isStyleLoaded()) {
      draw()
    } else {
      map.once('load', draw)
    }

    return () => {
      if (!mapRef.current) return
      const m = mapRef.current
      if (m.getLayer('route-line')) m.removeLayer('route-line')
      if (m.getLayer('route-start')) m.removeLayer('route-start')
      if (m.getLayer('route-end')) m.removeLayer('route-end')
      if (m.getSource('route')) m.removeSource('route')
      if (m.getSource('route-endpoints')) m.removeSource('route-endpoints')
    }
  }, [routeCoords])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !flyToCoord) return
    const fly = () => {
      map.flyTo({
        center: flyToCoord,
        zoom: flyToZoom ?? 16.5,
        duration: 1800,
        easing: easeInOut,
        ...(flyToOffset ? { offset: flyToOffset } : {}),
      })
    }
    if (map.isStyleLoaded()) {
      fly()
    } else {
      map.once('load', fly)
    }
  }, [flyToCoord])

  useEffect(() => {
    const map = mapRef.current
    const clear = () => {
      dropPointMarkersRef.current.forEach(m => m.remove())
      dropPointMarkersRef.current = []
      dropPointRootsRef.current.forEach(r => r.unmount())
      dropPointRootsRef.current = []
    }
    if (!map || !dropPoints?.length) { clear(); return }
    const add = () => {
      clear()
      dropPoints.forEach((coord, i) => {
        const el = document.createElement('div')
        const customIcon = dropPointIcons?.[i]
        if (customIcon != null) {
          const root = createRoot(el)
          root.render(customIcon)
          dropPointRootsRef.current.push(root)
          dropPointMarkersRef.current.push(
            new mapboxgl.Marker({ element: el, anchor: 'center' })
              .setLngLat(coord)
              .addTo(map)
          )
        } else if (i === 0) {
          const root = createRoot(el)
          root.render(<MarkerIcon color="#3F51B5" />)
          dropPointRootsRef.current.push(root)
          dropPointMarkersRef.current.push(
            new mapboxgl.Marker({ element: el, anchor: 'bottom' })
              .setLngLat(coord)
              .addTo(map)
          )
        } else {
          el.style.cssText = [
            'width:13px', 'height:13px', 'border-radius:50%',
            'background:#3F51B5',
            'border:2.5px solid white',
            'box-shadow:0 2px 6px rgba(0,0,0,0.28)',
          ].join(';')
          dropPointMarkersRef.current.push(
            new mapboxgl.Marker({ element: el, anchor: 'center' })
              .setLngLat(coord)
              .addTo(map)
          )
        }
      })
    }
    if (map.isStyleLoaded()) add()
    else map.once('load', add)
    return clear
  }, [dropPoints, dropPointIcons])

  useEffect(() => {
    const map = mapRef.current
    const cleanup = () => {
      cancelAnimationFrame(riderFrameRef.current)
      riderMarkerRef.current?.remove()
      riderMarkerRef.current = null
      riderRootRef.current?.unmount()
      riderRootRef.current = null
    }
    if (!map || !riderPath?.length || !riderIcon) { cleanup(); return }
    const setup = () => {
      cleanup()
      const el = document.createElement('div')
      const root = createRoot(el)
      root.render(riderIcon)
      riderRootRef.current = root
      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat(riderPath[0])
        .addTo(map)
      riderMarkerRef.current = marker
      if (followRider) {
        map.jumpTo({
          center: riderPath[0],
          zoom: riderFollowZoom,
          pitch: riderFollowPitch,
          bearing: riderFollowBearing && riderPath.length > 1
            ? calcHeading(riderPath[0][1], riderPath[0][0], riderPath[1][1], riderPath[1][0])
            : map.getBearing(),
        })
      }
      let startTime: number | null = null
      const animate = (ts: number) => {
        if (startTime === null) startTime = ts
        const t = ((ts - startTime) % riderDurationMs) / riderDurationMs
        const idx = Math.min(Math.floor(t * riderPath.length), riderPath.length - 1)
        const current = riderPath[idx]
        marker.setLngLat(current)
        if (followRider) {
          const next = riderPath[Math.min(idx + 1, riderPath.length - 1)]
          map.jumpTo({
            center: current,
            zoom: riderFollowZoom,
            pitch: riderFollowPitch,
            bearing: riderFollowBearing && next
              ? calcHeading(current[1], current[0], next[1], next[0])
              : map.getBearing(),
          })
        }
        riderFrameRef.current = requestAnimationFrame(animate)
      }
      riderFrameRef.current = requestAnimationFrame(animate)
    }
    if (map.isStyleLoaded()) setup()
    else map.once('load', setup)
    return cleanup
  }, [riderPath, riderIcon, riderDurationMs, followRider, riderFollowZoom, riderFollowPitch, riderFollowBearing])

  if (missingToken) {
    return <div className={`shuttle-map ${className ?? ''}`.trim()} />
  }

  return (
    <div
      ref={containerRef}
      className={`shuttle-map ${className ?? ''}`.trim()}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
