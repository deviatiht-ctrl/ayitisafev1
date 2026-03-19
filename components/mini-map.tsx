'use client'

import { useEffect, useRef, useState } from 'react'

interface MiniMapProps {
  location: { lat: number; lng: number } | null
  onLocationChange: (lat: number, lng: number) => void
}

export function MiniMap({ location, onLocationChange }: MiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [isReady, setIsReady] = useState(false)
  
  const onLocationChangeRef = useRef(onLocationChange)
  onLocationChangeRef.current = onLocationChange

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let isCancelled = false

    const initMap = async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      if (isCancelled || !containerRef.current) return

      const container = containerRef.current
      if ((container as any)._leaflet_id) {
        delete (container as any)._leaflet_id
      }

      const center: [number, number] = location 
        ? [location.lat, location.lng] 
        : [18.5392, -72.3288]

      const map = L.map(container, {
        center,
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map)

      // Handle click to set location
      map.on('click', (e: L.LeafletMouseEvent) => {
        onLocationChangeRef.current(e.latlng.lat, e.latlng.lng)
      })

      mapRef.current = map
      setIsReady(true)
    }

    initMap()

    return () => {
      isCancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      markerRef.current = null
      setIsReady(false)
    }
  }, [])

  // Update marker when location changes
  useEffect(() => {
    if (!isReady || !mapRef.current) return

    const L = window.L as typeof import('leaflet')

    // Remove old marker
    if (markerRef.current) {
      markerRef.current.remove()
      markerRef.current = null
    }

    if (location) {
      const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="width: 32px; height: 32px;">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#EF4444" stroke="white" stroke-width="3"/>
              <circle cx="16" cy="16" r="4" fill="white"/>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      markerRef.current = L.marker([location.lat, location.lng], { icon: markerIcon }).addTo(mapRef.current)
      mapRef.current.panTo([location.lat, location.lng])
    }
  }, [isReady, location])

  return (
    <div className="w-full h-[220px] rounded-xl overflow-hidden border border-border relative">
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ background: '#e5e7eb' }}
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-muted-foreground text-sm">Chaje kat la...</span>
        </div>
      )}
    </div>
  )
}
