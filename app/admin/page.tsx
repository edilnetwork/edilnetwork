
// app/admin/page.tsx
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic' // server component

export default async function AdminPage() {
  const count = await prisma.company.count()
  return (
    <main style={{ padding: 24 }}>
      <h1>Admin</h1>
      <p>Build OK. Aziende nel DB: {count}</p>
    </main>
  )
}
