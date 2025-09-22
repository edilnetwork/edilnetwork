// app/admin/page.tsx
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const count = await prisma.company.count()
  return (
    <main>
      <h1>Admin</h1>
      <p>Build OK. Aziende nel DB: {count}</p>
    </main>
  )
}
