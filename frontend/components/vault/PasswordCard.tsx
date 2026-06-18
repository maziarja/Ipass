'use client'

import { useState } from 'react'
import { Trash2, Link } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DeleteDialog } from './DeleteDialog'
import { deletePassword, type PasswordEntry } from '@/lib/passwords'

type Props = {
  entry: PasswordEntry
  onDelete: (id: string) => void
}

export function PasswordCard({ entry, onDelete }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)

  async function handleDelete() {
    // TODO: call deletePassword(entry.id) when backend is ready
    await deletePassword(entry.id)
    onDelete(entry.id)
    setDialogOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{entry.title}</CardTitle>
          <CardAction>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setDialogOpen(true)}
              aria-label={`Delete ${entry.title}`}
            >
              <Trash2 />
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <Badge variant="secondary" className="w-fit">
            {entry.category}
          </Badge>

          {entry.url && (
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 truncate text-xs text-muted-foreground hover:text-foreground"
            >
              <Link className="size-3 shrink-0" />
              <span className="truncate">{entry.url}</span>
            </a>
          )}

          <p className="font-mono text-sm tracking-widest text-muted-foreground select-none">
            ••••••••
          </p>
        </CardContent>
      </Card>

      <DeleteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleDelete}
        title={entry.title}
      />
    </>
  )
}
