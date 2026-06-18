'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from './input'
import { cn } from '@/lib/utils'

type Props = Omit<React.ComponentProps<'input'>, 'type'>

export function PasswordInput({ className, ...props }: Props) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <Input
        type={show ? 'text' : 'password'}
        className={cn('pr-9', className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground hover:text-foreground focus-visible:outline-none"
        aria-label={show ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}
