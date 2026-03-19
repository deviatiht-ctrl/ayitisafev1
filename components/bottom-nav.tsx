'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Map, Bell, Plus, User, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Map, label: 'Kat' },
  { href: '/alerts', icon: Bell, label: 'Alèt', badge: 5 },
  { href: '/report', icon: Plus, label: '', isCenter: true },
  { href: '/profile', icon: User, label: 'Pwofil' },
  { href: '/settings', icon: Settings, label: 'Paramèt' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -mt-6"
                aria-label="Rapòte Ensidan"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent shadow-lg hover:bg-accent/90 transition-colors">
                  <Icon className="w-6 h-6 text-accent-foreground" />
                </div>
              </Link>
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
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 flex items-center justify-center w-4 h-4 text-[10px] font-semibold text-white bg-destructive rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
