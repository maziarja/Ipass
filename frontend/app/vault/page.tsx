import { PasswordGrid } from '@/components/vault/PasswordGrid'
import { listPasswords } from '@/lib/passwords'

export default async function VaultPage() {
  // TODO: pass cookie header when backend is ready (see nextjs.md rules)
  const passwords = await listPasswords()

  // TODO: fetch masterSalt from /api/auth/me (pass cookie header)
  // const cookieStore = await cookies()
  // const res = await fetch(`${process.env.API_URL}/api/auth/me`, {
  //   headers: { Cookie: cookieStore.toString() },
  //   cache: 'no-store',
  // })
  // const data = await res.json()
  // const masterSalt: string = data.data.masterSalt ?? ''
  const masterSalt = ''

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">My Vault</h1>
          <p className="text-sm text-muted-foreground">
            {passwords.length === 0
              ? 'No saved passwords'
              : `${passwords.length} saved password${passwords.length === 1 ? '' : 's'}`}
          </p>
        </header>

        <PasswordGrid initialPasswords={passwords} masterSalt={masterSalt} />
      </div>
    </div>
  )
}
