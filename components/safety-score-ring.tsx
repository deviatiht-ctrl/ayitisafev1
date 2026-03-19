'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface SafetyScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function SafetyScoreRing({ 
  score, 
  size = 120, 
  strokeWidth = 10,
  className 
}: SafetyScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedScore / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 100)
    return () => clearTimeout(timer)
  }, [score])

  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-success'
    if (value >= 60) return 'text-accent'
    if (value >= 40) return 'text-warning'
    return 'text-destructive'
  }

  const getStrokeColor = (value: number) => {
    if (value >= 80) return '#22C55E'
    if (value >= 60) return '#F97316'
    if (value >= 40) return '#F59E0B'
    return '#EF4444'
  }

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getStrokeColor(animatedScore)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-3xl font-bold', getScoreColor(animatedScore))}>
          {Math.round(animatedScore)}%
        </span>
      </div>
    </div>
  )
}
