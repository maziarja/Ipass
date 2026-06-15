# Tailwind CSS Rules

## Setup

- Tailwind is configured in `frontend/tailwind.config.ts`.
- shadcn/ui adds its own colour tokens and CSS variables to `globals.css` during `shadcn init` — do not remove them.

## Class conventions

- Use `cn()` from `@/lib/utils` for conditional or merged class names — never string concatenation.
- Order classes: layout → spacing → sizing → typography → colour → state → responsive.
- Keep class lists readable: split long class strings across lines inside `cn()`.

```tsx
<div
  className={cn(
    'flex items-center gap-2 rounded-lg p-4',
    'border border-border bg-card text-card-foreground',
    isSelected && 'ring-2 ring-primary',
  )}
/>
```

## Colour — use semantic tokens

- Always prefer shadcn semantic tokens over raw Tailwind colours so light/dark mode works automatically.

| Token                  | Use for                         |
|------------------------|---------------------------------|
| `bg-background`        | Page background                 |
| `bg-card`              | Card surfaces                   |
| `text-foreground`      | Body text                       |
| `text-muted-foreground`| Secondary / placeholder text    |
| `border`               | Default border colour           |
| `bg-primary`           | Primary action buttons          |
| `text-destructive`     | Error messages, delete actions  |

## No inline styles

- Never use `style={{ ... }}` unless a value cannot be expressed as a Tailwind class (e.g. a dynamic pixel value from JS).

## Responsive design

- Mobile-first: write base styles for mobile, add `md:` / `lg:` prefixes for larger screens.
- Vault card grid example: `grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3`.
