import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { z } from "zod";

const passwordEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().nullable().optional(),
  category: z.string(),
  encrypted: z.string(),
  createdAt: z.string(),
});

export type PasswordEntry = z.infer<typeof passwordEntrySchema>;

export async function listPasswords(
  cookie: ReadonlyRequestCookies,
): Promise<PasswordEntry[]> {
  // TODO: GET /api/passwords (pass cookie header for server-side calls)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/passwords`, {
    method: "GET",
    headers: { cookie: cookie.toString() },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Unable to fetch passwords");
  const data = await res.json();

  return z.array(passwordEntrySchema).parse(data.data);
}

export async function createPassword(payload: {
  title: string;
  url?: string;
  category: string;
  encrypted: string;
}): Promise<PasswordEntry> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/passwords`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to save password");
  }
  const data = await res.json();
  return passwordEntrySchema.parse(data.data);
}

export async function updatePassword(
  id: string,
  payload: { title: string; url?: string; category: string; encrypted: string },
): Promise<PasswordEntry> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/passwords/${id}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to update password");
  }
  const data = await res.json();
  return passwordEntrySchema.parse(data.data);
}

export async function deletePassword(id: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/passwords/${id}`, {
    method: "DELETE",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to delete password");
  }
}
