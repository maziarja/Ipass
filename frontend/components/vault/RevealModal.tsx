"use client";

import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { decrypt } from "@/lib/crypto";
import { useVaultKey } from "@/lib/vaultKey";
import { type PasswordEntry } from "@/lib/passwords";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  entry: PasswordEntry;
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export function RevealModal({ entry, open, onOpenChange }: Props) {
  const { key } = useVaultKey();
  const [plaintext, setPlaintext] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(15);
  const [error, setError] = useState<string | null>(null);

  // Decrypt when dialog opens
  useEffect(() => {
    if (!open || !key) return;
    decrypt(entry.encrypted, key)
      .then((pt) => {
        setPlaintext(pt);
        setError(null);
        setSecondsLeft(15);
      })
      .catch(() =>
        setError("Failed to decrypt. Try locking and unlocking the vault."),
      );
    return () => {
      setPlaintext(null);
      setError(null);
    };
  }, [open, entry.encrypted, key]);

  // Auto-close countdown
  useEffect(() => {
    if (!open || !plaintext) return;
    const interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    const timeout = setTimeout(() => onOpenChange(false), 15_000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [open, plaintext, onOpenChange]);

  async function handleCopy() {
    if (!plaintext) return;
    try {
      await navigator.clipboard.writeText(plaintext);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{entry.title}</DialogTitle>
          <DialogDescription>
            {plaintext
              ? `Auto-hides in ${secondsLeft}s`
              : error
                ? "Could not decrypt this entry."
                : "Decrypting…"}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : plaintext ? (
          <div className="rounded-md border bg-muted/50 px-3 py-2">
            <p className="break-all font-mono text-sm select-all">
              {plaintext}
            </p>
          </div>
        ) : (
          <div className="h-10 animate-pulse rounded-md bg-muted" />
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {plaintext && (
            <Button onClick={handleCopy}>
              <Copy className="size-4" />
              Copy
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
