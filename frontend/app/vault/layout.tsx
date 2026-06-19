import type { ReactNode } from 'react'
import { VaultHeader } from '@/components/layout/VaultHeader'

export default function VaultLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <VaultHeader />
      {children}
    </>
  )
}
