export async function deriveKey(masterPassword: string, salt: ArrayBuffer): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(masterPassword),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 200_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encrypt(plaintext: string, key: CryptoKey): Promise<string> {
  const ivArray = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: ivArray.buffer as ArrayBuffer },
    key,
    new TextEncoder().encode(plaintext),
  )
  const blob = new Uint8Array(12 + encrypted.byteLength)
  blob.set(ivArray, 0)
  blob.set(new Uint8Array(encrypted), 12)
  return btoa(String.fromCharCode(...blob))
}

export async function decrypt(data: string, key: CryptoKey): Promise<string> {
  const blob = Uint8Array.from(atob(data), (c) => c.charCodeAt(0))
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: blob.slice(0, 12) },
    key,
    blob.slice(12),
  )
  return new TextDecoder().decode(decrypted)
}

export async function verifyMasterPassword(
  masterPassword: string,
  masterSalt: string,
  masterVerify: string,
): Promise<boolean> {
  try {
    const salt = Uint8Array.from(atob(masterSalt), (c) => c.charCodeAt(0)).buffer as ArrayBuffer
    const key = await deriveKey(masterPassword, salt)
    await decrypt(masterVerify, key)
    return true
  } catch {
    return false
  }
}
