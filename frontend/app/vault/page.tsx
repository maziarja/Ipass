import { PasswordGrid } from "@/components/vault/PasswordGrid";
import { listPasswords } from "@/lib/passwords";
import { cookies } from "next/headers";

export default async function VaultPage() {
  const storeCookies = await cookies();
  const passwords = await listPasswords(storeCookies);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">My Vault</h1>
        </header>

        <PasswordGrid initialPasswords={passwords} />
      </div>
    </div>
  );
}
