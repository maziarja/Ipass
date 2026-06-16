# iPass — Implementation Plan

**Legend**

- `[YOU]` — you write this (backend logic)
- `[CC]` — Claude Code writes this (frontend / UI)
- `[BOTH]` — setup/config, done together

---

## Phase 1 — Monorepo & Project Setup

Goal: get both apps running locally and talking to each other.

> The existing Next.js app stays at the repo root. We add a `backend/` folder alongside it.

| #    | Task                                                                                  | Owner    |
| ---- | ------------------------------------------------------------------------------------- | -------- |
| 1.1  | Create `backend/` folder and initialise with `npm init -y`                            | `[BOTH]` |
| 1.2  | Install and configure TypeScript in `backend/` (`tsconfig.json`, `ts-node-dev`)       | `[YOU]`  |
| 1.3  | Install Express + core middleware (`cors`, `helmet`, `cookie-parser`, `express.json`) | `[YOU]`  |
| 1.4  | Create `backend/src/index.ts` — bare Express app that starts on port 5001             | `[YOU]`  |
| 1.5  | Install Prisma, initialise schema, connect to Neon DB via `DATABASE_URL`              | `[YOU]`  |
| 1.6  | Add `backend/.env` with `DATABASE_URL`, `JWT_SECRET`, `PORT`                          | `[YOU]`  |
| 1.7  | Install shadcn/ui in the Next.js root (`npx shadcn@latest init`)                      | `[CC]`   |
| 1.8  | Install frontend deps: `react-hook-form`, `zod`, `@hookform/resolvers`                | `[CC]`   |
| 1.9  | Add `NEXT_PUBLIC_API_URL` / `API_URL` to `.env.local`                                 | `[BOTH]` |
| 1.10 | Verify: Express returns `{ ok: true }` on `GET /api/health`; Next.js home page loads  | `[BOTH]` |

---

## Phase 2 — Database Schema

Goal: define and migrate all DB tables.

| #   | Task                                                                          | Owner   |
| --- | ----------------------------------------------------------------------------- | ------- |
| 2.1 | Write `User` model in `backend/prisma/schema.prisma` (see `project-scope.md`) | `[YOU]` |
| 2.2 | Write `Password` model in the same schema file                                | `[YOU]` |
| 2.3 | Run `npx prisma migrate dev --name init` — creates tables in Neon DB          | `[YOU]` |
| 2.4 | Create `backend/src/lib/prisma.ts` singleton                                  | `[YOU]` |

---

## Phase 3 — Backend Auth API

Goal: register, login, logout, and master password setup endpoints.

| #   | Task                                                                                              | Owner   |
| --- | ------------------------------------------------------------------------------------------------- | ------- |
| 3.1 | `POST /api/auth/register` — validate body (Zod), hash password (bcrypt), create User              | `[YOU]` |
| 3.2 | `POST /api/auth/login` — verify password, sign JWT, set httpOnly cookie                           | `[YOU]` |
| 3.3 | `POST /api/auth/logout` — clear the JWT cookie                                                    | `[YOU]` |
| 3.4 | `POST /api/auth/setup-master` — validate `{ masterSalt, masterVerify }` (Zod), store both on User | `[YOU]` |
| 3.5 | `GET /api/auth/me` — return `{ id, email, hasMasterPassword }` for the logged-in user             | `[YOU]` |
| 3.6 | Auth middleware: verify JWT from cookie, attach `req.user`                                        | `[YOU]` |

---

## Phase 4 — Frontend Auth UI

Goal: register, login, and master password setup pages.

| #   | Task                                                                                                                | Owner  |
| --- | ------------------------------------------------------------------------------------------------------------------- | ------ |
| 4.1 | Add shadcn components: `Button`, `Input`, `Form`, `Card`, `Label`                                                   | `[CC]` |
| 4.2 | Create `/register` page — email + password + confirm password form (Zod + RHF)                                      | `[CC]` |
| 4.3 | Create `/login` page — email + password form                                                                        | `[CC]` |
| 4.4 | Create `/setup-master` page — master password + confirm form, shown once after first login                          | `[CC]` |
| 4.5 | `middleware.ts` at root — redirect unauthenticated users to `/login`; redirect to `/setup-master` if master not set | `[CC]` |
| 4.6 | Auth helper (`lib/auth.ts`) — typed `fetch` wrappers for register / login / logout / me                             | `[CC]` |

---

## Phase 5 — Encryption Utilities

Goal: browser-side crypto module used by the vault UI.

| #   | Task                                                                                         | Owner  |
| --- | -------------------------------------------------------------------------------------------- | ------ |
| 5.1 | `lib/crypto.ts` — `deriveKey(masterPassword, salt)` using PBKDF2                             | `[CC]` |
| 5.2 | `lib/crypto.ts` — `encrypt(plaintext, key)` → base64 string (iv + ciphertext combined)       | `[CC]` |
| 5.3 | `lib/crypto.ts` — `decrypt(data, key)` → plaintext string                                    | `[CC]` |
| 5.4 | `lib/crypto.ts` — `verifyMasterPassword(masterPassword, masterSalt, masterVerify)`           | `[CC]` |
| 5.5 | Manual test: encrypt a string, check the vault shows ciphertext, decrypt to recover original | `[CC]` |

---

## Phase 6 — Backend Passwords API

Goal: CRUD endpoints for encrypted password entries.

| #   | Task                                                                                 | Owner   |
| --- | ------------------------------------------------------------------------------------ | ------- |
| 6.1 | `GET /api/passwords` — list all entries for the logged-in user (no plaintext fields) | `[YOU]` |
| 6.2 | `POST /api/passwords` — validate body (Zod), create Password record                  | `[YOU]` |
| 6.3 | `PUT /api/passwords/:id` — update title, url, category, encrypted                    | `[YOU]` |
| 6.4 | `DELETE /api/passwords/:id` — delete entry (verify ownership first)                  | `[YOU]` |

---

## Phase 7 — Vault UI

Goal: main vault page where users see and manage their encrypted entries.

| #   | Task                                                                                      | Owner  |
| --- | ----------------------------------------------------------------------------------------- | ------ |
| 7.1 | Add shadcn components: `Dialog`, `Badge`, `Toast` (`useToast` hook)                       | `[CC]` |
| 7.2 | `/vault` Server Component — fetch password list from Express, pass to client grid         | `[CC]` |
| 7.3 | `PasswordCard` component — shows title, category badge, URL, and encrypted ciphertext     | `[CC]` |
| 7.4 | Category filter bar — filters the displayed cards client-side                             | `[CC]` |
| 7.5 | `/vault/new` page — "Add Password" form (title, url, category, password + strength meter) | `[CC]` |
| 7.6 | Password strength indicator component (length + character variety scoring)                | `[CC]` |
| 7.7 | Encrypt the password in the browser before POSTing to Express (uses Phase 5 utils)        | `[CC]` |
| 7.8 | Delete entry — confirmation dialog + DELETE request + optimistic UI update                | `[CC]` |

---

## Phase 8 — Reveal & Copy

Goal: let users decrypt and copy passwords using their master password.

| #   | Task                                                                                        | Owner  |
| --- | ------------------------------------------------------------------------------------------- | ------ |
| 8.1 | `RevealModal` component — Dialog that prompts for master password                           | `[CC]` |
| 8.2 | On submit: call `verifyMasterPassword()`, then `decryptPassword()`, display result in modal | `[CC]` |
| 8.3 | Auto-hide the revealed password after 15 seconds                                            | `[CC]` |
| 8.4 | "Copy" button on each card — verify master password silently, copy to clipboard, show Toast | `[CC]` |

---

## Phase 9 — Polish & UX

Goal: production-ready feel, good empty/error/loading states.

| #   | Task                                                                                   | Owner  |
| --- | -------------------------------------------------------------------------------------- | ------ |
| 9.1 | Loading skeleton for vault list while Server Component fetches                         | `[CC]` |
| 9.2 | Empty state illustration/message when vault has no entries                             | `[CC]` |
| 9.3 | Toast notifications for: save success, copy success, wrong master password, API errors | `[CC]` |
| 9.4 | Logout button in nav — calls `POST /api/auth/logout`, redirects to `/login`            | `[CC]` |
| 9.5 | Responsive layout — vault grid stacks on mobile                                        | `[CC]` |
| 9.6 | Edit password entry — prefill form, re-encrypt on save                                 | `[CC]` |

---

## Build order summary

```
Phase 1 (Setup)
    │
    ├── Phase 2 (Schema) → Phase 3 (Backend Auth) ──────────────────┐
    │                                                                 │
    └── Phase 4 (Auth UI) → Phase 5 (Crypto utils)                  │
                                    │                                 │
                             Phase 6 (Backend CRUD) ◄────────────────┘
                                    │
                             Phase 7 (Vault UI)
                                    │
                             Phase 8 (Reveal & Copy)
                                    │
                             Phase 9 (Polish)
```

Start Phase 4 and Phase 2–3 in parallel — frontend auth UI and backend auth API are independent until Phase 6.
