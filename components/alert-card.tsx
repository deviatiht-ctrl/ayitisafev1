'use client'

import { 
  Crosshair, 
  UserX, 
  Car, 
  Construction, 
  Users, 
  Shield, 
  AlertTriangle, 
  Droplets,
  MapPin,
  Share2,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Alert } from '@/lib/mock-data'

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  shooting: Crosshair,
  kidnapping: UserX,
  accident: Car,
  barricade: Construction,
  protest: Users,
  patrol: Shield,
  road_hazard: AlertTriangle,
  flood: Droplets,
}

const severityColors = {
  critical: 'border-l-destructive bg-destructive/5',
  warning: 'border-l-warning bg-warning/5',
  safe: 'border-l-success bg-success/5',
}

const severityBadgeColors = {
  critical: 'bg-destructive text-destructive-foreground',
  warning: 'bg-warning text-warning-foreground',
  safe: 'bg-success text-success-foreground',
}

const severityLabels = {
  critical: 'KRITIK',
  warning: 'ATANSYON',
  safe: 'SEKIRITE',
}

interface AlertCardProps {
  alert: Alert
  onViewOnMap: () => void
  onShare: () => void
  className?: string
}

export function AlertCard({ alert, onViewOnMap, onShare, className }: AlertCardProps) {
  const Icon = typeIcons[alert.type] || AlertTriangle

  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-border border-l-4 p-4 shadow-sm animate-fade-in',
        severityColors[alert.severity],
        className
      )}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full shrink-0',
            alert.severity === 'critical' && 'bg-destructive/10 text-destructive',
            alert.severity === 'warning' && 'bg-warning/10 text-warning',
            alert.severity === 'safe' && 'bg-success/10 text-success'
          )}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground text-sm line-clamp-2">
              {alert.title}
            </h3>
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0',
                severityBadgeColors[alert.severity]
              )}
            >
              {severityLabels[alert.severity]}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <MapPin className="w-3 h-3" />
            <span>{alert.location}, {alert.street}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Poste {alert.time}</span>
              <span className="flex items-center gap-1 text-accent">
                <Sparkles className="w-3 h-3" />
                IA: {alert.aiScore}%
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs"
              onClick={onViewOnMap}
            >
              <MapPin className="w-3 h-3 mr-1" />
              Wè sou Kat
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs"
              onClick={onShare}
            >
              <Share2 className="w-3 h-3 mr-1" />
              Pataje Alèt
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
