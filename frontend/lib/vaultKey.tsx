'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

type VaultKeyContextValue = {
  key: CryptoKey | null
  setKey: (key: CryptoKey) => void
}

const VaultKeyContext = createContext<VaultKeyContextValue | null>(null)

export function VaultKeyProvider({ children }: { children: ReactNode }) {
  const [key, setKey] = useState<CryptoKey | null>(null)
  return (
    <VaultKeyContext.Provider value={{ key, setKey }}>
      {children}
    </VaultKeyContext.Provider>
  )
}

export function useVaultKey() {
  const ctx = useContext(VaultKeyContext)
  if (!ctx) throw new Error('useVaultKey must be used inside VaultKeyProvider')
  return ctx
}
