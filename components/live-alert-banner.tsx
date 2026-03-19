'use client'

import { useState, useEffect } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LiveAlertBannerProps {
  message: string
  onDismiss?: () => void
  severity?: 'critical' | 'warning'
}

export function LiveAlertBanner({ 
  message, 
  onDismiss,
  severity = 'critical' 
}: LiveAlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
      setTimeout(() => {
        setIsVisible(false)
        onDismiss?.()
      }, 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-[60] transition-transform duration-300',
        isAnimating ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 text-white',
          severity === 'critical' 
            ? 'bg-gradient-to-r from-destructive to-destructive/80' 
            : 'bg-gradient-to-r from-warning to-warning/80 text-warning-foreground'
        )}
      >
        <AlertTriangle className="w-5 h-5 shrink-0" />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setIsAnimating(false)
            setTimeout(() => {
              setIsVisible(false)
              onDismiss?.()
            }, 300)
          }}
          className="p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Fèmen alèt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
