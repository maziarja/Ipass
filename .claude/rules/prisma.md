# Prisma + Neon DB Rules

## Connection

- Database is **Neon DB** (serverless PostgreSQL). Connection string goes in `backend/.env` as `DATABASE_URL`.
- Neon requires the `?sslmode=require` query param — it is included in the connection string from the Neon dashboard.

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

## Singleton client

- Instantiate `PrismaClient` once and reuse it. Never create a new client per request.

```ts
// backend/src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export default prisma
```

## Schema location

- Schema file lives at `backend/prisma/schema.prisma`.
- Run `npx prisma migrate dev --name <description>` to apply changes during development.
- Run `npx prisma generate` after schema changes to update the client types.

## Query rules

- Never `select` `passwordHash`, `masterSalt`, or `masterVerifyToken` unless the controller explicitly needs them (e.g. login, setup-master).
- Use `omit` or explicit `select` on user queries to exclude sensitive fields by default.

```ts
// safe default — omit sensitive fields
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, createdAt: true },
})
```

## Transactions

- Use `prisma.$transaction([...])` when multiple writes must succeed together.

## Migrations

- Never edit the database schema directly — always go through `prisma migrate dev`.
- Commit migration files to git.

## Neon-specific notes

- Neon pauses idle branches — the first query after a pause has a cold-start delay (~500ms). This is expected in development.
- Use the **main** Neon branch for development; create separate branches for staging/production if needed.
