# TypeScript Rules

## Config

- Enable `strict: true` in both `frontend/tsconfig.json` and `backend/tsconfig.json`.
- Backend: set `"module": "commonjs"`, `"outDir": "dist"`, `"rootDir": "src"`.
- Frontend: Next.js manages its own tsconfig — do not override `moduleResolution`.

## No `any`

- Never use `any`. Use `unknown` when the type is genuinely unknown, then narrow it.
- If a library lacks types, install `@types/<package>` or write a minimal `.d.ts`.

## Deriving types from Zod schemas

- Define Zod schemas as the single source of truth — infer TypeScript types from them.

```ts
import { z } from 'zod'

export const createPasswordSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url().optional(),
  category: z.string().min(1),
  ciphertext: z.string(),
  iv: z.string(),
  authTag: z.string(),
})

export type CreatePasswordInput = z.infer<typeof createPasswordSchema>
```

## Sharing types between frontend and backend

- Keep a `shared/` folder at the monorepo root for types and Zod schemas used on both ends (API response shapes, validation schemas).
- Import from `shared/` in both `frontend/` and `backend/`.

## Return types

- Always annotate the return type of async functions that interact with the DB or API.
- Use `Promise<T>` explicitly so errors in the return shape are caught at the call site.

## Express request typing

- Extend the `Request` type to include the authenticated user:

```ts
// backend/src/types/express.d.ts
declare namespace Express {
  interface Request {
    user?: { id: string; email: string }
  }
}
```
