'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Bell, Plus, Minus, User } from 'lucide-react'
import { BottomNav } from '@/components/bottom-nav'
import { LiveAlertBanner } from '@/components/live-alert-banner'
import { ZoneInfoCard } from '@/components/zone-info-card'
import { FilterChips } from '@/components/filter-chips'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { InteractiveMap } from '@/components/interactive-map'
import type { Zone } from '@/lib/mock-data'

const filterChips = [
  { id: 'all', label: 'Tout' },
  { id: 'danger', label: 'Danje', color: '#EF4444' },
  { id: 'safe', label: 'Sekirite', color: '#22C55E' },
  { id: 'routes', label: 'Wout' },
]

export default function MapPage() {
  const router = useRouter()
  const { activeFilter, setActiveFilter, showAlertBanner, setShowAlertBanner } = useAppStore()
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  const [showRoute, setShowRoute] = useState(false)
  const [alertMessage] = useState('Alèt — Tire tande nan Delmas 18')

  // Show alert banner periodically
  useEffect(() => {
    if (!showAlertBanner) {
      const timer = setTimeout(() => {
        setShowAlertBanner(true)
      }, 30000)
      return () => clearTimeout(timer)
    }
  }, [showAlertBanner, setShowAlertBanner])

  const handleZoneSelect = (zone: Zone) => {
    setSelectedZone(zone)
    setShowRoute(false)
  }

  const handleViewRoute = () => {
    setShowRoute(true)
    setSelectedZone(null)
  }

  const handleReport = () => {
    router.push('/report')
  }

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden">
      {/* Live Alert Banner */}
      {showAlertBanner && (
        <LiveAlertBanner
          message={alertMessage}
          severity="critical"
          onDismiss={() => setShowAlertBanner(false)}
        />
      )}

      {/* Map — isolate keeps Leaflet z-indexes (400-1000) inside this stacking context */}
      <div className="absolute inset-0 isolate">
        <InteractiveMap
          onZoneSelect={handleZoneSelect}
          selectedZone={selectedZone}
          showRoute={showRoute}
          activeFilter={activeFilter}
        />
      </div>

      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center gap-3 pt-safe">
        {/* Logo */}
        <div className="bg-card/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
          <Image
            src="/LOGO.jpg"
            alt="AyitiSafe"
            width={120}
            height={40}
            className="object-contain h-10 w-auto"
            priority
          />
        </div>

        {/* Search Bar */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-card/80 backdrop-blur-md rounded-full" />
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Trouve yon wout san danje..."
              className="w-full pl-10 pr-4 py-2.5 bg-transparent rounded-full text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* Icons */}
        <button 
          className="relative p-2.5 bg-card/80 backdrop-blur-md rounded-full shadow-lg"
          onClick={() => router.push('/alerts')}
        >
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>

        <button 
          className="p-2.5 bg-card/80 backdrop-blur-md rounded-full shadow-lg"
          onClick={() => router.push('/profile')}
        >
          <User className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Filter Chips */}
      <div className="absolute top-20 left-4 right-4 z-40 pt-safe">
        <FilterChips
          chips={filterChips}
          activeChip={activeFilter}
          onSelect={setActiveFilter}
        />
      </div>

      {/* Zoom Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="w-10 h-10 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => {
            // Zoom functionality handled by map
          }}
        >
          <Plus className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="w-10 h-10 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => {
            // Zoom functionality handled by map
          }}
        >
          <Minus className="w-5 h-5" />
        </Button>
      </div>

      {/* FAB - Report Incident */}
      <button
        onClick={handleReport}
        className="fixed bottom-24 right-4 z-50 flex items-center justify-center w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-xl hover:bg-accent/90 transition-transform active:scale-95"
        aria-label="Rapòte Ensidan"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Zone Info Card */}
      {selectedZone && (
        <ZoneInfoCard
          zone={selectedZone}
          onClose={() => setSelectedZone(null)}
          onViewRoute={handleViewRoute}
          onReport={handleReport}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </main>
  )
}
