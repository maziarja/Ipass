import { cn } from '@/lib/utils'

function getStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: 'Weak', color: 'bg-destructive' }
  if (score === 2) return { score, label: 'Fair', color: 'bg-orange-400' }
  if (score === 3) return { score, label: 'Good', color: 'bg-yellow-400' }
  return { score, label: 'Strong', color: 'bg-green-500' }
}

export function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null

  const { score, label, color } = getStrength(password)
  const filled = Math.min(Math.ceil((score / 5) * 4), 4)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              i < filled ? color : 'bg-muted',
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
