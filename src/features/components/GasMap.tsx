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
}

function makePinEl(color: string) {
  const el = document.createElement('span')
  el.className = 'gas-map-leaflet-pin'
  el.style.background = color
  const dot = document.createElement('i')
  el.appendChild(dot)
  return el
}

export default function GasMap({ center, zoom = 15, marker, markers }: GasMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const allMarkers: GasMapMarker[] = markers ?? (marker ? [{ position: marker }] : [])
  const markerKey = allMarkers.map((m) => `${m.position[0]},${m.position[1]},${m.color ?? ''}`).join('|')

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

  return <div className="gas-map-leaflet" ref={containerRef} aria-hidden="true" />
}
