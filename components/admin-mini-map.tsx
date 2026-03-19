'use client'

import { useEffect, useRef, useState } from 'react'
import type { Zone } from '@/lib/mock-data'

interface AdminMiniMapProps {
  zones: Zone[]
}

export function AdminMiniMap({ zones }: AdminMiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.LayerGroup | null>(null)
  const [isReady, setIsReady] = useState(false)

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

      const map = L.map(container, {
        center: [18.5392, -72.3288],
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map)

      layerRef.current = L.layerGroup().addTo(map)
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
      layerRef.current = null
      setIsReady(false)
    }
  }, [])

  // Update zones
  useEffect(() => {
    if (!isReady || !layerRef.current || !mapRef.current) return

    const L = window.L as typeof import('leaflet')
    layerRef.current.clearLayers()

    const getColor = (risk: string) => {
      switch (risk) {
        case 'critical': return '#EF4444'
        case 'high': return '#F97316'
        case 'moderate': return '#EAB308'
        case 'safe': return '#22C55E'
        default: return '#6B7280'
      }
    }

    zones.forEach((zone) => {
      const color = getColor(zone.risk)
      const radius = zone.risk === 'critical' ? 15 : zone.risk === 'high' ? 12 : 10

      const circle = L.circleMarker([zone.lat, zone.lng], {
        radius,
        fillColor: color,
        fillOpacity: 0.6,
        color: color,
        weight: 2,
      })

      circle.bindTooltip(`
        <div style="font-family: system-ui; font-size: 11px;">
          <p style="font-weight: 600; margin: 0;">${zone.name}</p>
          <p style="color: #94a3b8; margin: 2px 0 0;">${zone.incidentCount} ensidan</p>
        </div>
      `)

      circle.addTo(layerRef.current!)
    })
  }, [isReady, zones])

  return (
    <div className="w-full h-[200px] rounded-xl overflow-hidden relative">
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ background: '#1a1a2e' }}
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-card-dark">
          <span className="text-card-dark-foreground/50 text-sm">Chaje kat la...</span>
        </div>
      )}
    </div>
  )
}
