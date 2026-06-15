# Express.js Rules

## Project structure

```
backend/src/
├── routes/          # one file per resource (auth.routes.ts, passwords.routes.ts)
├── controllers/     # business logic called by routes
├── middleware/      # auth.middleware.ts, error.middleware.ts
├── lib/             # prisma.ts singleton, jwt.ts helpers
└── index.ts         # app setup and server start
```

## Route organisation

- Use `express.Router()` per resource, mount in `index.ts`.
- Keep route files thin — delegate to controllers.

```ts
// routes/passwords.routes.ts
import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import { listPasswords, createPassword } from '../controllers/passwords.controller'

const router = Router()
router.use(authenticate) // all password routes require auth
router.get('/', listPasswords)
router.post('/', createPassword)
export default router
```

## Async error handling

- Wrap every async route/controller in a try/catch and call `next(err)`.
- Add a global error middleware at the bottom of `index.ts`.

```ts
export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}
```

## Request validation

- Validate all request bodies with a Zod schema before any business logic.
- Return `400` with a structured error if validation fails.

```ts
const schema = z.object({ title: z.string().min(1), ciphertext: z.string() })
const body = schema.safeParse(req.body)
if (!body.success) return res.status(400).json({ errors: body.error.flatten() })
```

## Auth middleware

- Verify JWT from the httpOnly cookie (`req.cookies.token`).
- Attach `req.user = { id, email }` for downstream handlers.
- Return `401` if token is missing or invalid — no redirect.

## Security

- Never log or return `passwordHash`, `masterSalt`, or `masterVerifyToken` from any endpoint.
- Set CORS to allow only the Next.js origin with `credentials: true`.
- Use `helmet()` as the first middleware.

## Cookie setup

```ts
res.cookie('token', jwt, {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
})
```
