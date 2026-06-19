import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export function AuthHeader() {
  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <span className="font-semibold">iPass</span>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3" />
            Back to home
          </Link>
        </div>
      </div>
    </header>
  )
}
