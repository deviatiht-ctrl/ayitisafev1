'use client'

import { 
  Crosshair, 
  UserX, 
  Car, 
  Construction, 
  Users, 
  AlertTriangle, 
  Droplets,
  Flame,
  HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

const incidentTypes = [
  { id: 'shooting', icon: Crosshair, label: 'Tire', color: '#EF4444' },
  { id: 'kidnapping', icon: UserX, label: 'Kidnapping', color: '#1B2A4A' },
  { id: 'accident', icon: Car, label: 'Aksidan', color: '#F97316' },
  { id: 'barricade', icon: Construction, label: 'Barikad', color: '#F59E0B' },
  { id: 'protest', icon: Users, label: 'Manifestasyon', color: '#8B5CF6' },
  { id: 'road_hazard', icon: AlertTriangle, label: 'Wout Danjere', color: '#F59E0B' },
  { id: 'flood', icon: Droplets, label: 'Inondasyon', color: '#3B82F6' },
  { id: 'fire', icon: Flame, label: 'Dife', color: '#EF4444' },
  { id: 'other', icon: HelpCircle, label: 'Lòt', color: '#6B7280' },
]

interface IncidentTypeGridProps {
  selectedType: string | null
  onSelect: (type: string) => void
}

export function IncidentTypeGrid({ selectedType, onSelect }: IncidentTypeGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {incidentTypes.map((type) => {
        const Icon = type.icon
        const isSelected = selectedType === type.id

        return (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={cn(
              'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all',
              isSelected
                ? 'border-accent bg-accent/10 scale-[1.02]'
                : 'border-border bg-card hover:border-accent/50'
            )}
          >
            <div
              className={cn(
                'flex items-center justify-center w-12 h-12 rounded-full mb-2',
                isSelected ? 'bg-accent/20' : 'bg-muted'
              )}
              style={{ color: type.color }}
            >
              <Icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-foreground">{type.label}</span>
          </button>
        )
      })}
    </div>
  )
}
