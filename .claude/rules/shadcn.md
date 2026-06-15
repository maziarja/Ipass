# shadcn/ui Rules

## Installation

- Add components via the CLI — never install from npm as a package.
- Components are copied into `frontend/components/ui/` and are fully owned by this project.

```bash
npx shadcn@latest init          # first-time setup
npx shadcn@latest add button    # add a specific component
```

## Customisation

- Edit files in `frontend/components/ui/` freely — they are not dependencies.
- Do not re-run `shadcn add` for a component that already exists unless you want to overwrite local changes.

## Key components used in iPass

| Component  | Used for                                         |
|------------|--------------------------------------------------|
| `Button`   | All CTA buttons                                  |
| `Input`    | Text inputs (standalone, or inside Form)         |
| `Form`     | Wraps react-hook-form context + shadcn fields    |
| `Dialog`   | Reveal password modal, master password prompt    |
| `Badge`    | Category labels on vault entries                 |
| `Card`     | Password entry cards in vault list               |
| `Toast`    | Success/error feedback (copy, save, error)       |

## cn() utility

- Always use `cn()` for conditional class merging — do not concatenate class strings manually.

```ts
import { cn } from '@/lib/utils'

<div className={cn('base-class', isActive && 'active-class', className)} />
```

## Theming

- Colours are defined as CSS variables in `globals.css` — do not hardcode hex values in components.
- Use shadcn semantic tokens (`bg-background`, `text-foreground`, `border`, etc.) to keep light/dark mode consistent.
