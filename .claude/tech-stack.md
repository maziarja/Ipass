# iPass — Tech Stack

---

## Overview

| Layer            | Technology                          | Notes                                      |
|------------------|-------------------------------------|--------------------------------------------|
| Backend runtime  | Node.js + Express.js                | REST API, TypeScript                       |
| Frontend         | Next.js (App Router)                | TypeScript, Server Components for fetching |
| Database         | PostgreSQL via Neon DB              | Serverless Postgres, connection string in .env |
| ORM              | Prisma                              | Type-safe DB access, migrations            |
| Auth             | JWT in httpOnly cookies             | Set by Express, read by Next.js middleware |
| UI components    | shadcn/ui                           | Built on Radix UI + Tailwind CSS           |
| Styling          | Tailwind CSS                        | Utility-first, co-located with shadcn      |
| Forms            | react-hook-form + Zod               | Validation schema shared where possible    |
| Encryption       | Web Crypto API (browser)            | AES-256-GCM, PBKDF2 — never server-side   |
| Language         | TypeScript (both ends)              | Strict mode recommended                    |

---

## Repo structure (Monorepo)

```
node-next/
├── frontend/        # Next.js app (App Router, TypeScript)
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
├── backend/         # Express.js API (TypeScript)
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── controllers/
│   │   └── prisma/
│   └── ...
├── claude/          # Project docs
└── package.json     # Root (optional workspace config)
```

---

## Frontend detail

### Next.js Server Components (data fetching)
- Data is fetched in **Server Components** — no client-side fetch boilerplate, no loading spinners for initial data.
- Sensitive operations (decrypt, master password check) stay in **Client Components** using the Web Crypto API.
- JWT cookie is sent automatically by the browser on every request (httpOnly, `credentials: 'include'`).

### shadcn/ui
- Components live in `frontend/components/ui/` (added via `npx shadcn@latest add`).
- Not a dependency — source is copied into the project, fully customisable.

### react-hook-form + Zod
- Zod schemas define validation rules and TypeScript types in one place.
- `zodResolver` connects Zod schemas to react-hook-form.
- Used on every form: login, register, new password entry, reveal modal.

```ts
// example pattern
const schema = z.object({
  title: z.string().min(1),
  password: z.string().min(1),
})
type FormData = z.infer<typeof schema>
const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) })
```

---

## Backend detail

### Express.js (TypeScript)
- `ts-node-dev` for development hot-reload.
- Middleware: `cors` (allow Next.js origin + credentials), `helmet` (security headers), `cookie-parser` (read httpOnly JWT cookie), `express.json()`.

### JWT in httpOnly cookies
- On login, Express sets `res.cookie('token', jwt, { httpOnly: true, sameSite: 'lax', secure: true })`.
- Next.js forwards cookies on Server Component fetches automatically.
- On logout, Express clears the cookie.

### Prisma
- Schema lives in `backend/src/prisma/schema.prisma`.
- Run `npx prisma migrate dev` to apply schema changes.
- `PrismaClient` instantiated as a singleton.

---

## Encryption design

```
masterPassword + salt
  → PBKDF2(SHA-256, 200_000 iterations) → 32-byte AES key  [browser only]

plaintext + random IV
  → AES-256-GCM → { ciphertext, authTag }                   [browser only]

stored in DB: { ciphertext (base64), iv (base64), authTag (base64) }
```

- Salt generated once per user, stored on the `User` record.
- Fresh IV for every encrypt operation.
- The Express backend **never** sees plaintext or the derived key.
- Master password **never** stored — only a verification token (known plaintext encrypted with the derived key) is stored to confirm correctness.

---

## Key packages

### Frontend (`frontend/package.json`)
```json
{
  "next": "latest",
  "react": "latest",
  "react-dom": "latest",
  "zod": "latest",
  "react-hook-form": "latest",
  "@hookform/resolvers": "latest",
  "tailwindcss": "latest",
  "typescript": "latest"
}
```
shadcn/ui components are added via CLI, not listed here as a package.

### Backend (`backend/package.json`)
```json
{
  "express": "latest",
  "@prisma/client": "latest",
  "bcrypt": "latest",
  "jsonwebtoken": "latest",
  "cookie-parser": "latest",
  "cors": "latest",
  "helmet": "latest",
  "zod": "latest",
  "typescript": "latest",
  "ts-node-dev": "latest",
  "prisma": "latest"
}
```
