
import { prisma } from '@/lib/prisma'
import dynamic from 'next/dynamic'

export const dynamic = 'force-dynamic'

function isVerified(docs: {type:string, verified:boolean, expiresOn: Date | null}[]) {
  const now = new Date()
  const hasDurc = docs.some(d => d.type.toUpperCase()==='DURC' && d.verified && (!d.expiresOn || d.expiresOn > now))
  const hasRc   = docs.some(d => d.type.toUpperCase()==='RC'   && d.verified && (!d.expiresOn || d.expiresOn > now))
  return hasDurc && hasRc
}
function expiringSoon(docs: {expiresOn: Date | null}[], warnDays:number){
  const now = new Date(); const until = new Date(now.getTime()+warnDays*24*60*60*1000);
  return docs.some(d => d.expiresOn && d.expiresOn <= until)
}
function toRad(d:number){ return d*Math.PI/180 }
function haversineKm(a:{lat:number,lng:number}, b:{lat:number,lng:number}){
  const R=6371
  const dLat=toRad(b.lat-a.lat), dLng=toRad(b.lng-a.lng)
  const lat1=toRad(a.lat), lat2=toRad(b.lat)
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2
  return 2*R*Math.asin(Math.sqrt(h))
}

const MapLeaflet = dynamic(()=>import('../components/map-leaflet'), { ssr:false })

export default async function Page({ searchParams }: { searchParams?: { provincia?: string; skill?: string; verified?: string; lat?: string; lng?: string; r?: string } }){
  const provincia = (searchParams?.provincia || '').trim().toUpperCase()
  const skill = (searchParams?.skill || '').trim().toLowerCase()
  const wantVerified = (searchParams?.verified || '') === '1'
  const lat = searchParams?.lat ? parseFloat(searchParams.lat) : null
  const lng = searchParams?.lng ? parseFloat(searchParams.lng) : null
  const r = searchParams?.r ? parseFloat(searchParams.r) : null

  const companies = await prisma.company.findMany({ orderBy:{createdAt:'desc'}, take:500, include:{documents:true} })

  const filtered = companies.map(c => {
    const verified = isVerified(c.documents as any)
    const okProv = provincia ? (c.serviceAreas.toUpperCase().includes(provincia) || (c.province||'').toUpperCase().includes(provincia)) : true
    const okSkill = skill ? c.skills.toLowerCase().includes(skill) : true
    let dist: number | null = null
    let okRadius = true
    if (lat!=null && lng!=null && r!=null && c.lat!=null && c.lng!=null){
      dist = haversineKm({lat, lng}, {lat: c.lat as number, lng: c.lng as number})
      okRadius = dist <= r
    }
    return { c, verified, dist, ok: okProv && okSkill && (wantVerified?verified:true) && okRadius }
  }).filter(x=>x.ok)

  return (
    <section className="hero">
      <h1>Imprese registrate</h1>
      <form method="get" className="card" style={{marginBottom:20, display:'grid', gap:12}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:12}}>
          <label>Provincia <input name="provincia" placeholder="BA" defaultValue={provincia}/></label>
          <label>Skill <input name="skill" placeholder="cappotto, impianti..." defaultValue={skill}/></label>
          <label><input type="checkbox" name="verified" value="1" defaultChecked={wantVerified}/> Solo verificate</label>
          <label>Lat <input name="lat" placeholder="40.84" defaultValue={lat??''}/></label>
          <label>Lng <input name="lng" placeholder="17.34" defaultValue={lng??''}/></label>
          <label>Raggio (km) <input name="r" placeholder="30" defaultValue={r??''}/></label>
        </div>
        <div><button className="btn" type="submit">Filtra</button></div>
      </form>
      <div className="card" style={{marginBottom:20}}>
        <MapLeaflet
          points={filtered.filter(f => f.c.lat && f.c.lng).map(f => ({ id: f.c.id, name: f.c.legalName, lat: Number(f.c.lat), lng: Number(f.c.lng), verified: f.verified }))}
          center={lat!=null && lng!=null ? { lat, lng } : undefined}
          radiusKm={r!=null ? r : undefined}
        />
      </div>
      <table className="table">
        <thead><tr><th>Ragione sociale</th><th>Contatti</th><th>Aree</th><th>Skill</th><th>Stato</th><th>Distanza</th></tr></thead>
        <tbody>
          {filtered.map(({c, verified, dist}) => {
            const soon = expiringSoon(c.documents as any, Number(process.env.EXPIRY_WARN_DAYS||30))
            return (
              <tr key={c.id}>
                <td>{c.legalName}<div className="lead">P.IVA {c.vat}</div></td>
                <td>{c.contactName}<div className="lead">{c.email} • {c.phone}</div></td>
                <td>{c.serviceAreas}</td>
                <td>{c.skills}</td>
                <td>{verified ? <span className="badge badge-verified">Verificata</span> : '—'} {soon ? <span className="badge">In scadenza</span> : null}</td>
                <td>{dist!=null ? dist.toFixed(1)+' km' : '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
