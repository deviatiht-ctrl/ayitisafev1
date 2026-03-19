'use client'

import { cn } from '@/lib/utils'

interface FilterChip {
  id: string
  label: string
  color?: string
}

interface FilterChipsProps {
  chips: FilterChip[]
  activeChip: string
  onSelect: (id: string) => void
  className?: string
}

export function FilterChips({ chips, activeChip, onSelect, className }: FilterChipsProps) {
  return (
    <div className={cn('flex gap-2 overflow-x-auto pb-2 scrollbar-hide', className)}>
      {chips.map((chip) => (
        <button
          key={chip.id}
          onClick={() => onSelect(chip.id)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
            activeChip === chip.id
              ? 'bg-accent text-accent-foreground shadow-md'
              : 'bg-card text-foreground border border-border hover:bg-muted'
          )}
        >
          {chip.color && (
            <span
              className="inline-block w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: chip.color }}
            />
          )}
          {chip.label}
        </button>
      ))}
    </div>
  )
}
