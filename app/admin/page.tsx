
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

  const wrap: React.CSSProperties = { maxWidth: 1100, margin: '40px auto', padding: '0 16px' }
  const table: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: 16 }
  const thtd: React.CSSProperties = { borderBottom: '1px solid #eee', padding: 10, verticalAlign: 'top', textAlign: 'left' }
  const lead: React.CSSProperties = { color: '#555', fontSize: 12 }
  const badge: React.CSSProperties = { display: 'inline-block', padding: '2px 8px', borderRadius: 999, background: '#eee', fontSize: 12 }
  const badgeVerified: React.CSSProperties = { ...badge, background: '#e6ffed', color: '#03670d', border: '1px solid #a7f3d0' }

  return (
    <main style={wrap}>
      <h1>Admin • Aziende registrate</h1>
      <p style={lead}>Accesso protetto via Basic Auth (middleware). Utente e password dalle variabili d’ambiente.</p>

      <table style={table}>
        <thead>
          <tr>
            <th style={thtd}>Ragione sociale</th>
            <th style={thtd}>Contatti</th>
            <th style={thtd}>Aree / Skill</th>
            <th style={thtd}>Stato</th>
            <th style={thtd}>Doc.</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(c => {
            const verified = isVerified(c.documents as any)
            return (
              <tr key={c.id}>
                <td style={thtd}>
                  <strong>{c.legalName}</strong>
                  <div style={lead}>P.IVA {c.vat || '—'}</div>
                  <div style={lead}>
                    {c.city || '—'} {c.province ? `(${c.province})` : ''}
                  </div>
                </td>
                <td style={thtd}>
                  {c.contactName}
                  <div style={lead}>{c.email}</div>
                  <div style={lead}>{c.phone || '—'}</div>
                </td>
                <td style={thtd}>
                  <div>{c.serviceAreas}</div>
                  <div style={lead}>{c.skills}</div>
                </td>
                <td style={thtd}>
                  {verified ? <span style={badgeVerified}>Verificata</span> : <span style={badge}>Da verificare</span>}
                </td>
                <td style={thtd}>{(c.documents as any[]).length}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}

