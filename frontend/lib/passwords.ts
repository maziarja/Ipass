export type PasswordEntry = {
  id: string
  title: string
  url?: string | null
  category: string
  encrypted: string
  createdAt: string
}

export async function listPasswords(): Promise<PasswordEntry[]> {
  // TODO: GET /api/passwords (pass cookie header for server-side calls)
  return []
}

export async function createPassword(_payload: {
  title: string
  url?: string
  category: string
  encrypted: string
}): Promise<PasswordEntry> {
  // TODO: POST /api/passwords, return the created entry from the response
  throw new Error('createPassword not implemented')
}

export async function deletePassword(_id: string): Promise<void> {
  // TODO: DELETE /api/passwords/:id
}
