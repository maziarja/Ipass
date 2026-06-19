import Link from 'next/link'
import { ShieldCheck, Lock, KeyRound } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: ShieldCheck,
    title: 'Zero-knowledge',
    description:
      'Your master password never leaves your device — we never see it, store it, or transmit it.',
  },
  {
    icon: Lock,
    title: 'AES-256-GCM encryption',
    description:
      'Every password is encrypted in your browser before it ever reaches our servers.',
  },
  {
    icon: KeyRound,
    title: 'One key, everything',
    description:
      'One master password derives your encryption key. Only you can decrypt your vault.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Create an account',
    description: 'Register with your email and a login password.',
  },
  {
    number: '02',
    title: 'Set your master password',
    description:
      'Choose a strong master password. It derives your encryption key and is never stored anywhere.',
  },
  {
    number: '03',
    title: 'Save and reveal passwords',
    description:
      'Add entries to your vault. Reveal or copy any time by unlocking with your master password.',
  },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav */}
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="font-semibold">iPass</span>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className={buttonVariants({ size: 'sm' })}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your passwords.{' '}
            <span className="text-primary">Encrypted. Always.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            iPass encrypts every password in your browser with AES-256-GCM
            before it ever reaches our servers. Your master password never
            leaves your device.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className={buttonVariants({ size: 'lg' })}
            >
              Get started — it&apos;s free
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              Sign in
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="border-t py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight">
              Built with security first
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <Card key={title}>
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t py-20">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight">
              How it works
            </h2>
            <div className="flex flex-col gap-8">
              {steps.map(({ number, title, description }) => (
                <div key={number} className="flex gap-6">
                  <span
                    className={cn(
                      'shrink-0 font-mono text-3xl font-bold text-primary/30 leading-none',
                    )}
                  >
                    {number}
                  </span>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © 2026 iPass
      </footer>
    </div>
  )
}
