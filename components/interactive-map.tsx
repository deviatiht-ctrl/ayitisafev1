'use client'

// Native Leaflet implementation using vanilla Leaflet API
import { useEffect, useRef, useState } from 'react'
import type { Zone } from '@/lib/mock-data'
import { zones, alerts } from '@/lib/mock-data'

interface InteractiveMapProps {
  onZoneSelect: (zone: Zone) => void
  selectedZone: Zone | null
  showRoute: boolean
  activeFilter: string
}

export function InteractiveMap({ 
  onZoneSelect, 
  selectedZone, 
  showRoute,
  activeFilter 
}: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const zonesLayerRef = useRef<L.LayerGroup | null>(null)
  const incidentsLayerRef = useRef<L.LayerGroup | null>(null)
  const [isReady, setIsReady] = useState(false)
  
  // Store callbacks in refs to avoid re-initializing
  const onZoneSelectRef = useRef(onZoneSelect)
  onZoneSelectRef.current = onZoneSelect

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let isCancelled = false

    const initMap = async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      if (isCancelled || !containerRef.current) return

      // Double-check container doesn't already have a map
      const container = containerRef.current
      if ((container as any)._leaflet_id) {
        delete (container as any)._leaflet_id
      }

      // Create map
      const map = L.map(container, {
        center: [18.9712, -72.2852],
        zoom: 8,
        zoomControl: false,
      })

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      // Create layer groups
      zonesLayerRef.current = L.layerGroup().addTo(map)
      incidentsLayerRef.current = L.layerGroup().addTo(map)

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
      zonesLayerRef.current = null
      incidentsLayerRef.current = null
      setIsReady(false)
    }
  }, [])

  // Update zones
  useEffect(() => {
    if (!isReady || !zonesLayerRef.current || !mapRef.current) return

    const L = window.L as typeof import('leaflet')
    zonesLayerRef.current.clearLayers()

    const filteredZones = zones.filter((zone) => {
      if (activeFilter === 'all') return true
      if (activeFilter === 'danger') return zone.risk === 'critical'
      if (activeFilter === 'safe') return zone.risk === 'safe'
      if (activeFilter === 'routes') return false
      return true
    })

    filteredZones.forEach((zone) => {
      const color = zone.risk === 'critical' ? '#EF4444' :
                   zone.risk === 'warning' ? '#F59E0B' : '#22C55E'
      
      const opacity = zone.risk === 'critical' ? 0.5 :
                     zone.risk === 'warning' ? 0.4 : 0.2

      const circle = L.circle(zone.center, {
        radius: 2000,
        fillColor: color,
        fillOpacity: opacity,
        color: color,
        weight: 2,
        opacity: 0.8,
      })

      circle.on('click', () => {
        onZoneSelectRef.current(zone)
      })

      circle.addTo(zonesLayerRef.current!)
    })
  }, [isReady, activeFilter])

  // Update alerts/incidents on map
  useEffect(() => {
    if (!isReady || !incidentsLayerRef.current || !mapRef.current) return

    const L = window.L as typeof import('leaflet')
    incidentsLayerRef.current.clearLayers()

    // Find zone center for each alert based on location name
    alerts.filter(a => !a.resolved).forEach((alert) => {
      const zone = zones.find(z => z.name === alert.location)
      if (!zone) return

      const iconColor = alert.type === 'shooting' ? '#EF4444' :
                       alert.type === 'kidnapping' ? '#8B5CF6' :
                       alert.type === 'barricade' ? '#F59E0B' :
                       alert.type === 'protest' ? '#3B82F6' :
                       alert.type === 'accident' ? '#F97316' : '#6B7280'

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 28px;
          height: 28px;
          background: ${iconColor};
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="color: white; font-size: 12px; font-weight: bold;">!</span>
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      })

      const marker = L.marker(zone.center, { icon: customIcon })
      
      marker.bindPopup(`
        <div style="min-width: 140px; font-family: system-ui, sans-serif;">
          <strong style="font-size: 13px; color: #1B2A4A;">${alert.title}</strong>
          <p style="margin: 4px 0 2px; font-size: 11px; color: #64748b;">${alert.location}</p>
          <p style="margin: 0; font-size: 10px; color: #94a3b8;">${alert.time}</p>
        </div>
      `)

      marker.addTo(incidentsLayerRef.current!)
    })
  }, [isReady])

  // Handle selected zone
  useEffect(() => {
    if (!isReady || !mapRef.current || !selectedZone) return

    mapRef.current.flyTo(selectedZone.center, 12, {
      duration: 0.5,
    })
  }, [isReady, selectedZone])

  return (
    <div className="w-full h-full relative">
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ minHeight: '400px', background: '#e5e7eb' }}
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-muted-foreground animate-pulse">Chaje kat la...</div>
        </div>
      )}
    </div>
  )
}
