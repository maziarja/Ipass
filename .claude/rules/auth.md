# Auth Rules (JWT + httpOnly Cookie)

## How it works

1. User POSTs credentials to `POST /api/auth/login` on the Express backend.
2. Express verifies the password, signs a JWT, and sets it as an **httpOnly cookie**.
3. The browser sends this cookie automatically on every subsequent request to the backend.
4. Next.js Server Components forward cookies when fetching from Express.
5. On logout, Express clears the cookie with `res.clearCookie('token')`.

## JWT

- Sign with `jsonwebtoken` using a secret from `process.env.JWT_SECRET` (minimum 32 random characters).
- Payload: `{ id: string, email: string }` — keep it minimal.
- Expiry: `7d` (matches the cookie `maxAge`).
- Never put sensitive data (passwordHash, masterSalt) in the JWT payload.

## Cookie settings

```ts
res.cookie('token', token, {
  httpOnly: true,                                      // JS cannot read it
  sameSite: 'lax',                                     // CSRF protection
  secure: process.env.NODE_ENV === 'production',       // HTTPS only in prod
  maxAge: 7 * 24 * 60 * 60 * 1000,                    // 7 days in ms
})
```

## Express auth middleware

- Every protected route must go through `authenticate` middleware.
- Read the token from `req.cookies.token` (requires `cookie-parser`).
- Verify with `jwt.verify()` — catch errors and return `401`.
- Attach decoded user to `req.user` for downstream handlers.

## Next.js: forwarding cookies in Server Components

```ts
import { cookies } from 'next/headers'

const cookieStore = await cookies()
const res = await fetch(`${process.env.API_URL}/api/passwords`, {
  headers: { Cookie: cookieStore.toString() },
  cache: 'no-store',
})
```

## Route protection (Next.js middleware)

- `middleware.ts` at `frontend/` root checks for the JWT cookie.
- Redirect unauthenticated users to `/login`.
- Redirect authenticated users away from `/login` and `/register`.
- Redirect users without a master password set to `/setup-master`.

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const isAuth = !!token
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/register')

  if (!isAuth && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/vault/:path*', '/setup-master'] }
```

## What NOT to do

- Never store the JWT in `localStorage` or `sessionStorage`.
- Never read the JWT in client-side JavaScript.
- Never return the raw JWT value in an API response body.
