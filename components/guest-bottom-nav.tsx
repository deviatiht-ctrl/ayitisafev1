'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Map, Bell, Plus, User, Settings, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { LockedFeatureModal } from './locked-feature-modal'

const navItems = [
  { href: '/guest', icon: Map, label: 'Kat', locked: false },
  { href: '/guest/alerts', icon: Bell, label: 'Alèt', locked: false },
  { href: '#report', icon: Plus, label: '', isCenter: true, locked: true },
  { href: '#profile', icon: User, label: 'Pwofil', locked: true },
  { href: '/guest/settings', icon: Settings, label: 'Paramèt', locked: false },
]

export function GuestBottomNav() {
  const pathname = usePathname()
  const [showLocked, setShowLocked] = useState(false)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg safe-area-bottom">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            if (item.isCenter) {
              return (
                <button
                  key={item.href}
                  className="relative -mt-6"
                  aria-label="Rapòte Ensidan"
                  onClick={() => setShowLocked(true)}
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent shadow-lg">
                    <Icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-1 w-4 h-4 rounded-full bg-[#9CA3AF] flex items-center justify-center">
                    <Lock className="w-2.5 h-2.5 text-white" />
                  </div>
                </button>
              )
            }

            if (item.locked) {
              return (
                <button
                  key={item.href}
                  className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-muted-foreground"
                  onClick={() => setShowLocked(true)}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5" />
                    <div className="absolute -top-0.5 -right-1 w-3.5 h-3.5 rounded-full bg-[#9CA3AF] flex items-center justify-center">
                      <Lock className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-3 py-2 relative transition-colors',
                  isActive ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      <LockedFeatureModal open={showLocked} onClose={() => setShowLocked(false)} />
    </>
  )
}
