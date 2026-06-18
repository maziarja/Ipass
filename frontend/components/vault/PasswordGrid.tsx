"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryFilter } from "./CategoryFilter";
import { PasswordCard } from "./PasswordCard";
import { AddPasswordDialog } from "./AddPasswordDialog";
import { UnlockVaultDialog } from "./UnlockVaultDialog";
import { VaultKeyProvider, useVaultKey } from "@/lib/vaultKey";
import { type PasswordEntry } from "@/lib/passwords";

type Props = {
  initialPasswords: PasswordEntry[];
};

function VaultContent({ initialPasswords }: Props) {
  const { key } = useVaultKey();
  const [passwords, setPasswords] = useState<PasswordEntry[]>(initialPasswords);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered =
    selectedCategory === "All"
      ? passwords
      : passwords.filter((p) => p.category === selectedCategory);

  function handleDelete(id: string) {
    setPasswords((prev) => prev.filter((p) => p.id !== id));
  }

  function handleAdd(entry: PasswordEntry) {
    setPasswords((prev) => [entry, ...prev]);
  }

  function handleEdit(updated: PasswordEntry) {
    setPasswords((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  return (
    <>
      {!key && <UnlockVaultDialog />}

      <div className="flex flex-col gap-6">
        <p className="text-sm text-muted-foreground">
          {passwords.length === 0
            ? 'No saved passwords'
            : `${passwords.length} saved password${passwords.length === 1 ? '' : 's'}`}
        </p>
        <div className="flex items-center justify-between gap-4">
          <CategoryFilter
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
          <Button onClick={() => setDialogOpen(true)} className="shrink-0">
            <Plus />
            Add password
          </Button>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
            <p className="text-base font-medium text-foreground">
              No passwords yet
            </p>
            <p className="text-sm text-muted-foreground">
              Add your first entry to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((entry) => (
              <PasswordCard
                key={entry.id}
                entry={entry}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}

        <AddPasswordDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={handleAdd}
        />
      </div>
    </>
  );
}

export function PasswordGrid({ initialPasswords }: Props) {
  return (
    <VaultKeyProvider>
      <VaultContent initialPasswords={initialPasswords} />
    </VaultKeyProvider>
  );
}
