# Encryption Rules (Web Crypto API)

## Golden rule

**All encryption and decryption happens in the browser.** The Express backend never sees plaintext passwords or the derived AES key. It only stores and returns ciphertext.

## Key derivation (PBKDF2)

```ts
async function deriveKey(masterPassword: string, salt: Uint8Array): Promise<CryptoKey> {
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
```

- Salt is stored on the `User` record as `masterSalt` (base64). Generate once on master password setup: `crypto.getRandomValues(new Uint8Array(16))`.
- Never reuse a salt across users.

## Encryption (AES-256-GCM)

The IV (12 bytes) is prepended to the ciphertext and the whole thing is stored as one base64 string. No separate IV field needed.

```ts
async function encrypt(plaintext: string, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext),
  )
  const blob = new Uint8Array(12 + encrypted.byteLength)
  blob.set(iv, 0)
  blob.set(new Uint8Array(encrypted), 12)
  return btoa(String.fromCharCode(...blob))
}
```

## Decryption (AES-256-GCM)

Slice the first 12 bytes as the IV, pass the rest to `decrypt`.

```ts
async function decrypt(data: string, key: CryptoKey): Promise<string> {
  const blob = Uint8Array.from(atob(data), c => c.charCodeAt(0))
  const iv = blob.slice(0, 12)
  const ciphertext = blob.slice(12)
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
  return new TextDecoder().decode(decrypted)
}
```

## Master password verification

- On setup: derive the key, call `encrypt("ipass-verify", key)`, store the result in `masterVerify` on the User record.
- On reveal: derive the key from the entered master password + `masterSalt`, call `decrypt(masterVerify, key)`. If it throws, the master password is wrong.

```ts
// verify returns true if the master password is correct
async function verifyMasterPassword(
  masterPassword: string,
  masterSalt: string,
  masterVerify: string,
): Promise<boolean> {
  try {
    const salt = Uint8Array.from(atob(masterSalt), c => c.charCodeAt(0))
    const key = await deriveKey(masterPassword, salt)
    await decrypt(masterVerify, key)
    return true
  } catch {
    return false
  }
}
```

## DB fields per encrypted value

| Value             | Field stored     |
|-------------------|------------------|
| Password entry    | `encrypted`      |
| Master verify     | `masterVerify`   |
| Key derivation    | `masterSalt`     |

## Rules

- Generate a **fresh IV** inside every `encrypt` call — never reuse an IV.
- Never log or store the derived `CryptoKey` or the master password string beyond the scope of the current function.
- Never send the master password, the derived key, or any plaintext to the backend.
- If `decrypt` throws, show "Incorrect master password" — do not expose the raw error.
