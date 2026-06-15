@AGENTS.md

# iPass — Instructions for Claude Code

## Project context

This is a **learning project**. The goal is for the developer to learn Node.js backend development by writing it themselves.

- Claude Code is responsible for **frontend only**: Next.js pages, components, forms, and UI logic.
- The developer writes all **backend logic**: Express routes, controllers, middleware, Prisma queries, and auth.
- Do not generate backend implementation code unless explicitly asked. If a task touches the backend, describe what is needed and stop — let the developer write it.

## Before doing anything — read the rules

All project conventions live in `.claude/rules/`. **Check the relevant rule file before writing any code.**

| Rule file                             | Covers                                                          |
| ------------------------------------- | --------------------------------------------------------------- |
| `claude/rules/nextjs.md`              | Server vs Client Components, data fetching, routing, middleware |
| `claude/rules/express.md`             | Folder structure, routing, validation, cookies                  |
| `claude/rules/prisma.md`              | Neon DB connection, singleton client, safe queries              |
| `claude/rules/typescript.md`          | Strict mode, no `any`, Zod-inferred types                       |
| `claude/rules/shadcn.md`              | Component install, cn(), theming                                |
| `claude/rules/react-hook-form-zod.md` | Schema-first forms, shadcn Form integration                     |
| `claude/rules/tailwind.md`            | Semantic tokens, cn(), responsive design                        |
| `claude/rules/auth.md`                | JWT cookie flow, Next.js middleware                             |
| `claude/rules/encryption.md`          | PBKDF2 key derivation, AES-GCM, Web Crypto API                  |

Also see `claude/project-scope.md` for feature scope and `claude/tech-stack.md` for stack decisions.

## Debugging and problem solving

**Always find the root cause — never patch over symptoms.**

- When something doesn't work, identify WHY before touching any file.
- Do not add workarounds (`/// <reference>` directives, `ignoreDeprecations`, inline overrides) to silence an error caused by a misconfiguration elsewhere. Fix the misconfiguration.
- Ask yourself: "Does this fix the actual problem, or does it just hide it?" If the answer is "hides it", stop and dig deeper.
- A one-line hack that papers over a structural issue is worse than a slightly larger fix that corrects the root cause — it leaves a trap for the next problem.

## Before installing packages or implementing any core feature

**Always use Context7 first.** Run the `mcp__context7__resolve-library-id` and `mcp__context7__query-docs` tools to fetch up-to-date documentation for the relevant library before writing code or installing packages. Do not rely on training data alone — APIs and conventions may have changed.
