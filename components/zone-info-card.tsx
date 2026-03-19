'use client'

import { X, Navigation, FileWarning, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { Zone } from '@/lib/mock-data'

interface ZoneInfoCardProps {
  zone: Zone
  onClose: () => void
  onViewRoute: () => void
  onReport: () => void
}

export function ZoneInfoCard({ zone, onClose, onViewRoute, onReport }: ZoneInfoCardProps) {
  const riskLabels = {
    critical: 'KRITIK',
    warning: 'ATANSYON',
    safe: 'SEKIRITE',
  }

  const riskColors = {
    critical: 'bg-destructive text-destructive-foreground',
    warning: 'bg-warning text-warning-foreground',
    safe: 'bg-success text-success-foreground',
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-fade-in">
      <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden max-w-md mx-auto">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{zone.name}</h3>
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mt-1',
                  riskColors[zone.risk]
                )}
              >
                <Shield className="w-3 h-3" />
                {riskLabels[zone.risk]}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-muted transition-colors"
              aria-label="Fèmen"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileWarning className="w-4 h-4" />
              <span>{zone.lastIncident}</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Konfyans IA</span>
                <span className="font-semibold text-accent">{zone.aiScore}%</span>
              </div>
              <Progress value={zone.aiScore} className="h-2" />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Ensidan aktif:</span>
              <span className="font-semibold">{zone.incidentCount}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 p-4 pt-0">
          <Button
            onClick={onViewRoute}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Wè Wout Sekirite
          </Button>
          <Button
            onClick={onReport}
            variant="outline"
            className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <FileWarning className="w-4 h-4 mr-2" />
            Rapòte
          </Button>
        </div>
      </div>
    </div>
  )
}
