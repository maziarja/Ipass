# Encryption Rules (Web Crypto API)

## Golden rule

**All encryption and decryption happens in the browser.** The Express backend never sees plaintext passwords or the derived AES key. It only stores and returns ciphertext.

## Key derivation (PBKDF2)

```ts
async function deriveKey(masterPassword: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(masterPassword),
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

- Salt is stored on the `User` record (base64). Generate once on master password setup with `crypto.getRandomValues(new Uint8Array(16))`.
- Never reuse a salt across users.

## Encryption (AES-256-GCM)

```ts
async function encryptPassword(plaintext: string, key: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12)) // fresh IV every time
  const enc = new TextEncoder()
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext),
  )
  // AES-GCM appends the 16-byte authTag at the end of the ciphertext buffer
  const ciphertext = encrypted.slice(0, encrypted.byteLength - 16)
  const authTag = encrypted.slice(encrypted.byteLength - 16)
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    iv: btoa(String.fromCharCode(...new Uint8Array(iv))),
    authTag: btoa(String.fromCharCode(...new Uint8Array(authTag))),
  }
}
```

## Decryption (AES-256-GCM)

```ts
async function decryptPassword(
  ciphertext: string,
  iv: string,
  authTag: string,
  key: CryptoKey,
): Promise<string> {
  const toBytes = (b64: string) => Uint8Array.from(atob(b64), c => c.charCodeAt(0))
  const combined = new Uint8Array([...toBytes(ciphertext), ...toBytes(authTag)])
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: toBytes(iv) },
    key,
    combined,
  )
  return new TextDecoder().decode(decrypted)
}
```

## Master password verification token

- On setup, encrypt a known string (e.g. `"ipass-verify"`) with the derived key and store `{ ciphertext, iv, authTag }` on the User record.
- On reveal, derive the key from the entered master password + stored salt, then attempt to decrypt the verification token. If decryption throws, the master password is wrong.

## Rules

- Generate a **fresh IV** (`crypto.getRandomValues(new Uint8Array(12))`) for every encrypt call — never reuse an IV.
- Never log or store the derived `CryptoKey` object or the master password string beyond the scope of the current function call.
- Never send the master password, the derived key, or any plaintext to the backend.
- If `crypto.subtle.decrypt` throws, catch it silently and show "Incorrect master password" — do not expose the raw error.
