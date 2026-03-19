'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, Clock } from 'lucide-react'
import { BottomNav } from '@/components/bottom-nav'
import { FilterChips } from '@/components/filter-chips'
import { AlertCard } from '@/components/alert-card'
import { alerts } from '@/lib/mock-data'
import type { Alert } from '@/lib/mock-data'

const filterChips = [
  { id: 'all', label: 'Tout' },
  { id: 'critical', label: 'Kritik', color: '#EF4444' },
  { id: 'warning', label: 'Atansyon', color: '#F59E0B' },
  { id: 'nearby', label: 'Pre m' },
  { id: 'resolved', label: 'Rezoud', color: '#22C55E' },
]

export default function AlertsPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated] = useState(new Date())

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }, [])

  const filteredAlerts = alerts.filter((alert: Alert) => {
    switch (activeFilter) {
      case 'critical':
        return alert.severity === 'critical'
      case 'warning':
        return alert.severity === 'warning'
      case 'resolved':
        return alert.resolved
      case 'nearby':
        // Mock nearby filter - in real app would use geolocation
        return ['Delmas 18', 'Delmas 33'].includes(alert.location)
      default:
        return true
    }
  })

  const handleViewOnMap = (alert: Alert) => {
    // Navigate to map with alert location
    router.push(`/?focus=${alert.location}`)
  }

  const handleShare = (alert: Alert) => {
    if (navigator.share) {
      navigator.share({
        title: 'AyitiSafe Alèt',
        text: `${alert.title} - ${alert.location}`,
        url: window.location.href,
      })
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${alert.title} - ${alert.location}`)
    }
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border pt-safe">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-foreground">Sant Alèt</h1>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Aktyalize</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Clock className="w-3 h-3" />
            <span>
              Dènye aktyalizasyon: {lastUpdated.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <FilterChips
            chips={filterChips}
            activeChip={activeFilter}
            onSelect={setActiveFilter}
          />
        </div>
      </header>

      {/* Alert List */}
      <div className="px-4 py-4 space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Pa gen alèt nan kategori sa a</p>
          </div>
        ) : (
          filteredAlerts.map((alert, index) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onViewOnMap={() => handleViewOnMap(alert)}
              onShare={() => handleShare(alert)}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
            />
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </main>
  )
}
