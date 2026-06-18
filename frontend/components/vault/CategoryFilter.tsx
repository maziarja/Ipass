'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CATEGORIES } from '@/lib/schemas/passwordSchemas'

const ALL_CATEGORIES = ['All', ...CATEGORIES] as const

type Props = {
  selected: string
  onChange: (cat: string) => void
}

export function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {ALL_CATEGORIES.map((cat) => (
        <Button
          key={cat}
          variant={selected === cat ? 'default' : 'outline'}
          size="sm"
          className={cn('shrink-0 rounded-full')}
          onClick={() => onChange(cat)}
        >
          {cat}
        </Button>
      ))}
    </div>
  )
}
