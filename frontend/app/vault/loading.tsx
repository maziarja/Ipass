export default function VaultLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">My Vault</h1>
        </header>

        <div className="flex flex-col gap-6">
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-muted" />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
