'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Loader2 } from 'lucide-react'
import { logout } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export function VaultHeader() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handleLogout() {
    setPending(true)
    await logout()
    router.push('/login')
  }

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <span className="font-semibold">iPass</span>
        <Button variant="ghost" size="sm" onClick={handleLogout} disabled={pending}>
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          Log out
        </Button>
      </div>
    </header>
  )
}
