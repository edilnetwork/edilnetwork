// app/admin/page.tsx
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function isVerified(docs: { type: string; verified: boolean; expiresOn: Date | null }[]) {
  const now = new Date()
  const hasDurc = docs.some(d => d.type.toUpperCase() === 'DURC' && d.verified && (!d.expiresOn || d.expiresOn > now))
  const hasRc = docs.some(d => d.type.toUpperCase() === 'RC' && d.verified && (!d.expiresOn || d.expiresOn > now))
  return hasDurc && hasRc
}

export default async function AdminPage() {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: 'desc' },
    include: { documents: true },
    take: 200,
  })

  return (
    <main style={{ maxWidth: 1100, margin: '40px auto', padding: '0 16px' }}>
      <h1>Admin • Aziende registrate</h1>
      <p className="lead">Accesso protetto. Utente e password dalle variabili d’ambiente.</p>

      <table className="table" style={{ width: '100%', marginTop: 16 }}>
        <thead>
          <tr>
            <th>Ragione sociale</th>
            <th>Contatti</th>
            <th>Aree / Skill</th>
            <th>Stato</th>
            <th>Doc.</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(c => {
            const verified = isVerified(c.documents as any)
            return (
              <tr key={c.id}>
                <td>
                  <strong>{c.legalName}</strong>
                  <div className="lead">P.IVA {c.vat || '—'}</div>
                  <div className="lead">{c.city || '—'} {c.province ? `(${c.province})` : ''}</div>
                </td>
                <td>
                  {c.contactName}
                  <div className="lead">{c.email}</div>
                  <div className="lead">{c.phone || '—'}</div>
                </td>
                <td>
                  <div>{c.serviceAreas}</div>
                  <div className="lead">{c.skills}</div>
                </td>
                <td>
                  {verified ? <span className="badge badge-verified">Verificata</span> : <span className="badge">Da verificare</span>}
                </td>
                <td>{(c.documents as any[]).length}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <style jsx>{`
        .table { border-collapse: collapse; }
        th, td { border-bottom: 1px solid #eee; padding: 10px; vertical-align: top; text-align: left; }
        .lead { color: #555; font-size: 12px; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; background: #eee; font-size: 12px; }
        .badge-verified { background: #e6ffed; color: #03670d; border: 1px solid #a7f3d0; }
      `}</style>
    </main>
  )
}
