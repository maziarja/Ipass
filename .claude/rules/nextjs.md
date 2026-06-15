# Next.js Rules

## Server vs Client Components

- Default to **Server Components** — no `'use client'` unless the component needs browser APIs, state, or event handlers.
- Use Client Components for: forms, reveal modal, clipboard, any Web Crypto API call.
- Never do data fetching in a Client Component when a Server Component parent can do it.

```tsx
// Server Component — fetch directly, no useEffect
export default async function VaultPage() {
  const passwords = await getPasswords() // calls Express API
  return <PasswordList passwords={passwords} />
}
```

## Data fetching from Express

- Fetch from the Express API using `fetch()` inside Server Components with `{ cache: 'no-store' }` for user-specific data.
- Pass the cookie header manually when fetching server-side:

```ts
import { cookies } from 'next/headers'

async function getPasswords() {
  const cookieStore = await cookies()
  const res = await fetch(`${process.env.API_URL}/api/passwords`, {
    headers: { Cookie: cookieStore.toString() },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}
```

## Routing

- Use the App Router (`app/` directory) exclusively — no `pages/` directory.
- Protect routes with middleware (`middleware.ts` at the project root): check for the JWT cookie and redirect to `/login` if missing.
- `(auth)` route group for login/register pages (no layout wrapper needed).

## Environment variables

- Backend URL → `NEXT_PUBLIC_API_URL` is **not** needed for Server Components — use `API_URL` (server-only).
- Never expose secrets in `NEXT_PUBLIC_*` variables.

## Mutations

- Use **Server Actions** or client-side `fetch` to POST/PUT/DELETE to Express.
- After a mutation, call `revalidatePath('/vault')` (in Server Actions) or `router.refresh()` (in Client Components) to re-fetch updated data.
