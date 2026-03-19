'use client'

import { useState } from 'react'
import { GuestBottomNav } from '@/components/guest-bottom-nav'
import { GuestBanner } from '@/components/guest-banner'
import { LockedFeatureModal } from '@/components/locked-feature-modal'
import { AlertCard } from '@/components/alert-card'
import { Bell, Filter } from 'lucide-react'
import { alerts } from '@/lib/mock-data'

export default function GuestAlertsPage() {
  const [showLocked, setShowLocked] = useState(false)

  return (
    <main className="min-h-[100dvh] bg-background pb-20">
      <GuestBanner />

      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1B2A4A]">Alèt</h1>
            <p className="text-sm text-[#64748B] mt-0.5">Dènye rapò yo nan zòn ou</p>
          </div>
          <button
            onClick={() => setShowLocked(true)}
            className="p-2.5 bg-white rounded-full shadow-sm border border-[#E2E8F0]"
          >
            <Filter className="w-5 h-5 text-[#1B2A4A]" />
          </button>
        </div>
      </div>

      {/* Alert Cards - show limited in guest mode */}
      <div className="px-5 flex flex-col gap-3">
        {alerts.slice(0, 3).map((alert) => (
          <AlertCard key={alert.id} alert={alert} onViewOnMap={() => setShowLocked(true)} onShare={() => setShowLocked(true)} />
        ))}

        {/* Locked overlay for more alerts */}
        <button
          onClick={() => setShowLocked(true)}
          className="relative bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] flex flex-col items-center justify-center min-h-[120px]"
        >
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#F4F6F9] flex items-center justify-center mb-2">
              <Bell className="w-6 h-6 text-[#9CA3AF]" />
            </div>
            <p className="text-sm font-medium text-[#1B2A4A]">Kreye yon kont pou wè plis alèt</p>
            <p className="text-xs text-accent font-semibold mt-1">Kreye Kont Gratis →</p>
          </div>
        </button>
      </div>

      <GuestBottomNav />
      <LockedFeatureModal open={showLocked} onClose={() => setShowLocked(false)} />
    </main>
  )
}
