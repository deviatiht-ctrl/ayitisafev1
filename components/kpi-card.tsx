'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
}

export function KPICard({ 
  title, 
  value, 
  icon, 
  trend = 'neutral',
  trendValue,
  className 
}: KPICardProps) {
  return (
    <div className={cn(
      'bg-card-dark rounded-xl p-4 space-y-3',
      className
    )}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-card-dark-foreground/70 uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2 bg-card-dark-foreground/10 rounded-lg">
          {icon}
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold text-card-dark-foreground">
          {value}
        </p>
        
        {trendValue && (
          <div className="flex items-center gap-1 text-xs">
            {trend === 'up' && (
              <>
                <TrendingUp className="w-3 h-3 text-destructive" />
                <span className="text-destructive">{trendValue}</span>
              </>
            )}
            {trend === 'down' && (
              <>
                <TrendingDown className="w-3 h-3 text-success" />
                <span className="text-success">{trendValue}</span>
              </>
            )}
            {trend === 'neutral' && (
              <span className="text-card-dark-foreground/50">{trendValue}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
