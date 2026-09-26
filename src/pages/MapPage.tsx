import { useEffect, useRef, useState } from 'react'
import { LocateFixed, Layers2, Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import 'mapbox-gl/dist/mapbox-gl.css'

const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
const styleUrl = import.meta.env.VITE_MAPBOX_STYLE_URL
const townCenters: Record<string, [number, number]> = {
  Windhoek: [17.0832, -22.5609],
  Swakopmund: [14.5266, -22.6784],
  'Walvis Bay': [14.5053, -22.9576],
  Oshakati: [15.7985, -17.7883],
  Ondangwa: [15.941, -17.914],
  Rundu: [19.7731, -17.925],
  'Katima Mulilo': [24.2642, -17.5003],
  Otjiwarongo: [16.6475, -20.4637],
  Tsumeb: [17.7167, -19.2333],
  Grootfontein: [18.1167, -19.5667],
  Gobabis: [18.9667, -22.45],
  Keetmanshoop: [18.1333, -26.5833],
  Lüderitz: [15.1594, -26.6481],
  Mariental: [17.9667, -24.6333],
  Rehoboth: [17.0833, -23.3167],
}

export function MapPage() {
  const mapElement = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [locating, setLocating] = useState(false)
  const [locationMessage, setLocationMessage] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const { profile } = useAuth()
  const town = profile?.town?.trim() || 'Windhoek'
  const center = townCenters[town] ?? townCenters.Windhoek
  const configured = Boolean(accessToken && styleUrl)

  useEffect(() => {
    if (!configured || !mapElement.current) return
    let instance: import('mapbox-gl').Map | null = null
    let cancelled = false
    void import('mapbox-gl').then(({ default: mapboxgl }) => {
      if (cancelled || !mapElement.current) return
      mapboxgl.accessToken = accessToken
      instance = new mapboxgl.Map({
        container: mapElement.current,
        style: styleUrl,
        center,
        zoom: 12,
        logoPosition: 'bottom-right',
        attributionControl: true,
        performanceMetricsCollection: false,
        cooperativeGestures: true,
        pitchWithRotate: false,
      })
      map.current = instance
      instance.once('load', () => setMapReady(true))
      instance.on('error', () => setMapError(true))
    }).catch(() => setMapError(true))

    return () => {
      cancelled = true
      instance?.remove()
      map.current = null
    }
  }, [configured, center])

  const locateMe = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Location is not available in this browser.')
      return
    }
    setLocating(true)
    setLocationMessage(null)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        map.current?.flyTo({ center: [coords.longitude, coords.latitude], zoom: 14, essential: false })
        setLocationMessage('Map centered on your location. Mapbox receives tile requests for the area shown.')
        setLocating(false)
      },
      () => {
        setLocationMessage('Location unavailable. Check browser permission and try again.')
        setLocating(false)
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    )
  }

  const searchArea = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = searchQuery.trim()
    if (!query || !accessToken || !map.current) return
    setSearching(true)
    setLocationMessage(null)
    try {
      const endpoint = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`)
      endpoint.searchParams.set('access_token', accessToken)
      endpoint.searchParams.set('country', 'NA')
      endpoint.searchParams.set('limit', '1')
      const response = await fetch(endpoint)
      if (!response.ok) throw new Error('Search failed')
      const result = await response.json() as { features?: Array<{ center: [number, number]; place_name: string }> }
      const feature = result.features?.[0]
      if (!feature) setLocationMessage('No matching place found. Try another search.')
      else {
        map.current.flyTo({ center: feature.center, zoom: 14, essential: false })
        setSearchQuery(feature.place_name)
      }
    } catch {
      setLocationMessage('Area search is unavailable. Check your connection and try again.')
    } finally {
      setSearching(false)
    }
  }

  return (
    <main className="map-screen" aria-label="Beacon safety map">
      <div className="map-canvas" ref={mapElement} aria-label={`Interactive map centered on ${town}`} />
      {(!configured || mapError) && <div className="map-unconfigured" role="status">
        <div className="map-grid" aria-hidden="true" />
        <span className="map-brand">BEACON MAP</span>
        <strong>{mapError ? 'Map service unavailable' : 'Map setup needed'}</strong>
        <p>{mapError ? 'Check the Mapbox style URL and public token.' : 'Add a public Mapbox token and style URL to enable the interactive map.'}</p>
      </div>}

      <header className="map-top-ui">
        <div className="map-title"><strong>Map</strong><span>{town}</span></div>
        <form className="map-search" onSubmit={searchArea}><Search size={17} aria-hidden="true" /><label className="sr-only" htmlFor="map-area-search">Search map area</label><input id="map-area-search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search area" disabled={!mapReady} /><button type="submit" disabled={!mapReady || searching || !searchQuery.trim()}>{searching ? '…' : 'Go'}</button></form>
        <div className="map-mode" aria-label="Map view">
          <button className="selected" type="button">Map</button>
          <button type="button" disabled>Live</button>
          <button type="button" disabled>List</button>
        </div>
      </header>

      {configured && <div className="map-controls">
        <button type="button" onClick={locateMe} disabled={!mapReady || locating} aria-label="Center map on my location"><LocateFixed size={19} /></button>
        <button type="button" disabled aria-label="Map layers unavailable until incident data is connected"><Layers2 size={19} /></button>
      </div>}

      {locationMessage && <div className="map-location-message" role="status">{locationMessage}</div>}

      <section className="map-context-sheet" aria-label="Nearby safety activity">
        <span className="sheet-handle" aria-hidden="true" />
        <small>NEAR YOU NOW</small>
        <strong>No live incident data</strong>
        <p>Incident data is not connected. The map will show reports here when the service is ready.</p>
        {!configured && <span className="map-disclosure">Map tiles and area searches use Mapbox. Your device location is requested only when you tap the location button.</span>}
      </section>
    </main>
  )
}
