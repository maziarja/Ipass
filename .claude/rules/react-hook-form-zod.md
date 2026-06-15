# react-hook-form + Zod Rules

## Pattern: schema first

Always define the Zod schema before the component. The schema is the source of truth for both validation and the TypeScript type.

```ts
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
})
type LoginFormData = z.infer<typeof loginSchema>
```

## Connecting to react-hook-form

```ts
const form = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: '', password: '' },
})
```

## With shadcn Form components

Use shadcn's `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, and `FormMessage` — they wire into react-hook-form context automatically.

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" {...field} />
          </FormControl>
          <FormMessage /> {/* shows Zod error message */}
        </FormItem>
      )}
    />
  </form>
</Form>
```

## Forms in iPass

| Form              | Key fields                                        |
|-------------------|---------------------------------------------------|
| Register          | email, password, confirmPassword                  |
| Login             | email, password                                   |
| Setup master      | masterPassword, confirmMasterPassword             |
| New password      | title, url (optional), category, password         |
| Reveal modal      | masterPassword                                    |

## Submission

- Always disable the submit button while `form.formState.isSubmitting` is true.
- On API errors, use `form.setError('root', { message: '...' })` to show a general error.
- Reset the form after successful submission with `form.reset()`.
