import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import './gas-map.css'

// CARTO's free vector basemap style (no API key required for the style/tiles
// themselves — the key in VITE_CARTO_API_KEY is reserved for authenticated
// CARTO data layers, should this preview ever need to query real datasets).
const CARTO_STYLE_URL = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'

type GasMapMarker = { position: [number, number]; color?: string }

type GasMapProps = {
  center: [number, number]
  zoom?: number
  marker?: [number, number]
  markers?: GasMapMarker[]
  /** A road route using [latitude, longitude] positions. */
  route?: [number, number][]
  /** A moving rider position using [latitude, longitude]. */
  rider?: [number, number]
  /** Fit the route and its endpoints into the visible map area. */
  fitRoute?: boolean
}

function makePinEl(color: string) {
  const el = document.createElement('span')
  el.className = 'gas-map-leaflet-pin'
  el.style.background = color
  const dot = document.createElement('i')
  el.appendChild(dot)
  return el
}

function makeRiderEl() {
  const el = document.createElement('span')
  el.className = 'gas-map-live-rider'
  el.setAttribute('aria-hidden', 'true')
  el.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="17" r="2.7"/><circle cx="19" cy="17" r="2.7"/><path d="m7.7 17 3.1-6h4.3l3.9 6M10.8 11l-2-3m6.3 3 2.1-3M10 14h6.5"/><circle class="rider-head" cx="14" cy="6" r="2"/></svg>'
  return el
}

export default function GasMap({ center, zoom = 15, marker, markers, route, rider, fitRoute = false }: GasMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const riderMarkerRef = useRef<maplibregl.Marker | null>(null)
  const allMarkers: GasMapMarker[] = markers ?? (marker ? [{ position: marker }] : [])
  const markerKey = allMarkers.map((m) => `${m.position[0]},${m.position[1]},${m.color ?? ''}`).join('|')
  const routeKey = route?.map(([lat, lng]) => `${lat},${lng}`).join('|') ?? ''

  useEffect(() => {
    if (!containerRef.current) return
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: CARTO_STYLE_URL,
      // Leaflet/MapLibre both use [lng, lat] — our props take [lat, lng] to
      // match the shape callers already use for Leaflet-style coordinates.
      center: [center[1], center[0]],
      zoom,
      interactive: false,
      attributionControl: false,
    })
    mapRef.current = map
    if (fitRoute && route?.length) {
      const bounds = new maplibregl.LngLatBounds()
      route.forEach(([lat, lng]) => bounds.extend([lng, lat]))
      allMarkers.forEach(({ position }) => bounds.extend([position[1], position[0]]))
      map.once('load', () => {
        map.fitBounds(bounds, {
          padding: { top: 86, right: 28, bottom: 270, left: 28 },
          maxZoom: 14.8,
          duration: 0,
        })
      })
    }
    return () => {
      map.remove()
      mapRef.current = null
    }
    // center/zoom intentionally fixed at mount — these previews are static decorative maps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const markerInstances = allMarkers.map(({ position, color }) =>
      new maplibregl.Marker({ element: makePinEl(color ?? '#197aff') }).setLngLat([position[1], position[0]]).addTo(map)
    )
    return () => { markerInstances.forEach((m) => m.remove()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerKey])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !route?.length) return
    const addRoute = () => {
      if (map.getSource('delivery-route')) return
      map.addSource('delivery-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: route.map(([lat, lng]) => [lng, lat]) },
        },
      })
      map.addLayer({
        id: 'delivery-route-casing', type: 'line', source: 'delivery-route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#ffffff', 'line-width': 7, 'line-opacity': 0.92 },
      })
      map.addLayer({
        id: 'delivery-route-line', type: 'line', source: 'delivery-route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#2581ff', 'line-width': 3.5, 'line-dasharray': [1.1, 1.45], 'line-opacity': 0.95 },
      })
    }
    if (map.isStyleLoaded()) addRoute()
    else map.once('load', addRoute)
    return () => { map.off('load', addRoute) }
  }, [routeKey])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !rider) return
    const position: [number, number] = [rider[1], rider[0]]
    if (!position.every(Number.isFinite)) return
    if (!riderMarkerRef.current) {
      // Marker must have coordinates before being attached; addTo triggers its first position update.
      riderMarkerRef.current = new maplibregl.Marker({ element: makeRiderEl(), anchor: 'center' })
        .setLngLat(position)
        .addTo(map)
      return
    }
    riderMarkerRef.current.setLngLat(position)
  }, [rider?.[0], rider?.[1]])

  useEffect(() => () => {
    riderMarkerRef.current?.remove()
    riderMarkerRef.current = null
  }, [])

  return <div className="gas-map-leaflet" ref={containerRef} aria-hidden="true" />
}
