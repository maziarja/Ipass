# iPass — Encrypted Password Manager

A zero-knowledge password manager built as a learning project for Node.js backend development. Every password is encrypted in the browser with AES-256-GCM before it ever reaches the server. The master password never leaves your device.

## Features

- **Zero-knowledge encryption** — passwords are encrypted client-side using the Web Crypto API; the server stores and returns only ciphertext
- **AES-256-GCM + PBKDF2** — master password derives a 256-bit key; each entry is encrypted with a fresh random IV
- **Vault unlock flow** — master password is verified locally by attempting to decrypt a known token; no server round-trip
- **Reveal & copy** — passwords are decrypted in-memory on demand and auto-hidden after 15 seconds
- **Orange/black theme with dark mode** — light/dark toggle powered by `next-themes`, respects system preference on first visit
- **JWT auth** — httpOnly cookie, 7-day expiry, proxied through Next.js so cookie is always on the same domain

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui (base-nova) |
| Forms | react-hook-form + Zod |
| Encryption | Web Crypto API (PBKDF2, AES-256-GCM) — browser only |
| Backend | Express.js, TypeScript |
| Database | PostgreSQL via Neon DB (serverless), Prisma ORM |
| Auth | JWT in httpOnly cookie, `cookie-parser`, `jsonwebtoken` |
| Deployment | Vercel (frontend) + Railway (backend) |

## Project structure

```
node-next/
├── frontend/          # Next.js app
│   ├── app/           # App Router pages and layouts
│   ├── components/    # UI components (vault, layout, forms)
│   └── lib/           # Crypto helpers, API fetch wrappers
└── backend/
    └── src/
        ├── routes/        # Express routers (one per resource)
        ├── controllers/   # Business logic
        ├── middlewares/   # JWT auth middleware
        ├── lib/           # Prisma singleton, JWT helpers
        └── schemas/       # Zod validation schemas
```

## Local setup

### Prerequisites

- Node.js 20+
- A [Neon DB](https://neon.tech) project (free tier is enough)

### 1. Clone

```bash
git clone https://github.com/maziarja/Ipass.git
cd Ipass
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="at-least-32-random-characters"
PORT=5000
NODE_ENV=development
```

Run migrations and start:

```bash
npx prisma migrate dev
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
API_URL=http://localhost:5000
```

Start:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

The app is deployed with the frontend proxying all `/api/*` requests to the backend so the auth cookie is always on the same origin.

### Frontend — Vercel

Set this environment variable in the Vercel dashboard:

```
API_URL=https://your-railway-backend-url.railway.app
```

The `next.config.ts` rewrite handles the proxy automatically — no `NEXT_PUBLIC_*` variable needed.

### Backend — Railway

Set these environment variables in the Railway dashboard:

```
DATABASE_URL=...
JWT_SECRET=...
NODE_ENV=production
```

The build command (`prisma generate && tsc`) generates the Prisma client before compiling TypeScript. The start command is `node dist/src/server.js`.

> **Cookie note:** In production, the JWT cookie uses `sameSite: "none"` + `secure: true` so it survives the Vercel → Railway cross-domain proxy request.
