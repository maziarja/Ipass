'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, LockKeyhole } from 'lucide-react'

import { getMasterCredentials } from '@/lib/auth'
import { deriveKey, decrypt } from '@/lib/crypto'
import { useVaultKey } from '@/lib/vaultKey'
import { Button } from '@/components/ui/button'
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

const schema = z.object({
  masterPassword: z.string().min(1, 'Master password is required'),
})
type FormData = z.infer<typeof schema>

export function UnlockVaultDialog() {
  const { setKey } = useVaultKey()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { masterPassword: '' },
  })

  async function onSubmit(data: FormData) {
    try {
      const { masterSalt, masterVerify } = await getMasterCredentials()
      const salt = Uint8Array.from(atob(masterSalt), (c) => c.charCodeAt(0))
        .buffer as ArrayBuffer
      // Derive once and reuse for both verification and storing in context.
      const key = await deriveKey(data.masterPassword, salt)
      let isValid: boolean
      try {
        await decrypt(masterVerify, key)
        isValid = true
      } catch {
        isValid = false
      }
      if (!isValid) {
        form.setError('masterPassword', { message: 'Incorrect master password' })
        return
      }
      setKey(key)
    } catch {
      form.setError('masterPassword', { message: 'Something went wrong. Try again.' })
    }
  }

  return (
    <Dialog open>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <div className="mb-1 flex justify-center">
            <LockKeyhole className="size-8 text-muted-foreground" />
          </div>
          <DialogTitle className="text-center">Unlock your vault</DialogTitle>
          <DialogDescription className="text-center">
            Enter your master password to decrypt your entries.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="masterPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Master password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="current-password"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              {form.formState.isSubmitting ? 'Unlocking…' : 'Unlock'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
