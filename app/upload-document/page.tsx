
'use client'
import { useEffect, useState } from 'react'
type Company = { id:string; legalName:string }
export default function Page(){
  const [companies,setCompanies] = useState<Company[]>([])
  const [companyId,setCompanyId] = useState('')
  const [file,setFile] = useState<File|null>(null)
  const [type,setType] = useState('DURC')
  const [expiresOn,setExpiresOn] = useState('')
  const [status,setStatus] = useState('')
  useEffect(()=>{ fetch('/api/companies?list=1').then(r=>r.json()).then(setCompanies) }, [])
  async function upload(){
    if(!companyId || !file){ setStatus('Seleziona impresa e file'); return }
    setStatus('Generazione URL...')
    const pres = await fetch('/api/uploads/presign', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ filename: file.name, type: file.type }) }).then(r=>r.json())
    setStatus('Caricamento file...')
    await fetch(pres.uploadUrl, { method:'PUT', headers:{'Content-Type': file.type||'application/octet-stream'}, body: file })
    setStatus('Salvataggio metadati...')
    await fetch('/api/documents', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ companyId, type, filename:file.name, key: pres.key, expiresOn }) })
    setStatus('Fatto!')
  }
  return (
    <section className="hero">
      <h1>Carica un documento</h1>
      <div className="card" style={{display:'grid',gap:12}}>
        <label>Impresa
          <select value={companyId} onChange={e=>setCompanyId(e.target.value)}>
            <option value="">—</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.legalName}</option>)}
          </select>
        </label>
        <label>Tipo
          <select value={type} onChange={e=>setType(e.target.value)}>
            <option>DURC</option><option>RC</option><option>SOA</option><option>CERT</option><option>ALTRO</option>
          </select>
        </label>
        <label>Scadenza <input type="date" value={expiresOn} onChange={e=>setExpiresOn(e.target.value)} /></label>
        <label>File <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} /></label>
        <button className="btn" onClick={upload}>Carica</button>
        {status && <p className="lead">{status}</p>}
      </div>
    </section>
  )
}
