'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import {
  editPasswordSchema,
  type EditPasswordFormData,
  CATEGORIES,
} from '@/lib/schemas/passwordSchemas'
import { encrypt } from '@/lib/crypto'
import { updatePassword, type PasswordEntry } from '@/lib/passwords'
import { useVaultKey } from '@/lib/vaultKey'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

type Props = {
  entry: PasswordEntry
  open: boolean
  onOpenChange: (v: boolean) => void
  onSuccess: (updated: PasswordEntry) => void
}

export function EditPasswordDialog({ entry, open, onOpenChange, onSuccess }: Props) {
  const { key } = useVaultKey()

  const form = useForm<EditPasswordFormData>({
    resolver: zodResolver(editPasswordSchema),
    values: {
      title: entry.title,
      url: entry.url ?? '',
      category: entry.category,
      password: '',
    },
  })

  async function onSubmit(data: EditPasswordFormData) {
    if (!key) return
    try {
      const encrypted =
        data.password ? await encrypt(data.password, key) : entry.encrypted

      const updated = await updatePassword(entry.id, {
        title: data.title,
        url: data.url || undefined,
        category: data.category,
        encrypted,
      })

      onSuccess(updated)
      onOpenChange(false)
    } catch (err) {
      form.setError('root', {
        message: err instanceof Error ? err.message : 'Something went wrong',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit password</DialogTitle>
          <DialogDescription>
            Leave the password field blank to keep the existing one.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    URL <span className="font-normal text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="url" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <p className="text-sm leading-none font-medium">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <Button
                        key={cat}
                        type="button"
                        variant={field.value === cat ? 'default' : 'outline'}
                        size="sm"
                        className="rounded-full"
                        onClick={() => field.onChange(cat)}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    New password <span className="font-normal text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" placeholder="Leave blank to keep current" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
            )}

            <Button type="submit" disabled={form.formState.isSubmitting || !key} className="w-full">
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              {form.formState.isSubmitting ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
