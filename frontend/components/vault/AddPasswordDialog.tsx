'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AddPasswordForm } from './AddPasswordForm'
import { type PasswordEntry } from '@/lib/passwords'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  masterSalt: string
  onSuccess: (entry: PasswordEntry) => void
}

export function AddPasswordDialog({ open, onOpenChange, masterSalt, onSuccess }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a password</DialogTitle>
          <DialogDescription>
            Your password is encrypted in the browser before it is saved.
          </DialogDescription>
        </DialogHeader>
        <AddPasswordForm
          masterSalt={masterSalt}
          onSuccess={(entry) => {
            onOpenChange(false)
            onSuccess(entry)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
