# iPass — Project Scope

A learning project: a password manager with a **Node.js/Express REST API** backend and a **Next.js** frontend. Users log in, set a master password, and store passwords that are always displayed encrypted. Decryption only happens client-side after the user re-enters the correct master password.

> Tech stack details are in [tech-stack.md](./tech-stack.md).

---

## Auth flow

1. User registers with **email + login password** (bcrypt hash stored in DB).
2. On first login, user sets a **master password**.
   - Master password is **never stored** — only a PBKDF2-derived key is used at runtime.
   - A verification token (known plaintext encrypted with the derived key) is stored so the app can confirm the master password is correct later.
3. Login → Express returns a **JWT in an httpOnly cookie**.
4. Next.js Server Components forward the cookie on every API call automatically.

---

## Core features

### Password vault
- Save a password entry: **title**, **URL (optional)**, **category**, and the **password**.
- Password is encrypted with AES-256-GCM (key derived from master password via PBKDF2) **in the browser** before being sent to the backend.
- Backend stores only ciphertext — it never sees the plaintext.
- Vault list always shows the **encrypted ciphertext**, never the real password.

### Reveal password
- User clicks "Reveal" on an entry → modal prompts for master password.
- If master password is correct (checked via verification token), the entry is decrypted **client-side** (Web Crypto API) and shown in the modal.

### Copy to clipboard
- Silently decrypts the password after master password confirmation and copies it to clipboard — never displays it on screen.

### Categories / tags
- Each entry belongs to one category (Work, Social, Banking, Personal, etc.).
- Vault list is filterable by category.

### Password strength indicator
- Visual meter when creating/editing an entry, scored on length, character variety, and common patterns.

---

## Data model (Prisma)

```prisma
model User {
  id                String     @id @default(cuid())
  email             String     @unique
  passwordHash      String     // bcrypt hash of login password
  masterSalt        String?    // PBKDF2 salt for key derivation
  masterVerifyToken String?    // known plaintext encrypted with derived key
  masterVerifyIv    String?    // IV used for masterVerifyToken
  createdAt         DateTime   @default(now())
  passwords         Password[]
}

model Password {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  title      String
  url        String?
  category   String
  ciphertext String   // AES-256-GCM encrypted password (base64)
  iv         String   // initialization vector (base64)
  authTag    String   // GCM auth tag (base64)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

---

## API endpoints (Express)

| Method | Path                       | Description                        |
|--------|----------------------------|------------------------------------|
| POST   | /api/auth/register         | Create account                     |
| POST   | /api/auth/login            | Login → sets JWT cookie            |
| POST   | /api/auth/logout           | Clears JWT cookie                  |
| POST   | /api/auth/setup-master     | Set master password (first-time)   |
| GET    | /api/passwords             | List all encrypted entries         |
| POST   | /api/passwords             | Create new entry                   |
| PUT    | /api/passwords/:id         | Update entry                       |
| DELETE | /api/passwords/:id         | Delete entry                       |

---

## Frontend pages (Next.js)

| Route               | Component type  | Description                            |
|---------------------|-----------------|----------------------------------------|
| `/`                 | Server          | Landing page                           |
| `/register`         | Client          | Sign up form (react-hook-form + Zod)   |
| `/login`            | Client          | Login form                             |
| `/setup-master`     | Client          | Set master password (first login only) |
| `/vault`            | Server + Client | Vault list (fetch server, reveal client)|
| `/vault/new`        | Client          | Add new password entry                 |

---

## Out of scope (for now)

- Password sharing between users
- Two-factor authentication
- Browser extension
- Import/export (CSV, 1Password, Bitwarden)
- Password history / versioning
