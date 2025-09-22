
'use client'
import { useState } from 'react'

type CompanyPayload = {
  legalName: string; vat?: string; contactName: string; email: string; phone?: string;
  serviceAreas: string; skills: string; province?: string; city?: string; lat?: number|null; lng?: number|null
}
type Errors = Partial<Record<keyof CompanyPayload, string>>
const isEmail = (v:string)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const toNumOrNull = (v:string)=> v.trim()===''? null : (Number.isFinite(Number(v))? Number(v): null)

export default function CompanyForm(){
  const [form,setForm]=useState<CompanyPayload>({legalName:'',vat:'',contactName:'',email:'',phone:'',serviceAreas:'',skills:'',province:'',city:'',lat:null,lng:null})
  const [errors,setErrors]=useState<Errors>({})
  const [status,setStatus]=useState('')

  function set<K extends keyof CompanyPayload>(k:K, v:CompanyPayload[K]){ setForm(p=>({...p,[k]:v})) }
  function validate(d:CompanyPayload){ const e:Errors={}
    if(!d.legalName.trim()) e.legalName='Ragione sociale obbligatoria'
    if(!d.contactName.trim()) e.contactName='Nome referente obbligatorio'
    if(!d.email.trim()) e.email='Email obbligatoria'; else if(!isEmail(d.email)) e.email='Email non valida'
    if(!d.serviceAreas.trim()) e.serviceAreas='Aree di servizio obbligatorie'
    if(!d.skills.trim()) e.skills='Competenze obbligatorie'
    if(d.province && d.province.trim().length>3) e.province='Usa sigla provincia (BA, BR, TA)'
    const latGiven=d.lat!==null&&d.lat!==undefined, lngGiven=d.lng!==null&&d.lng!==undefined
    if(latGiven!==lngGiven){ e.lat='Inserisci sia Lat che Lng'; e.lng='Inserisci sia Lat che Lng' }
    return e
  }

  async function onSubmit(ev:React.FormEvent){
    ev.preventDefault(); setStatus('')
    const e=validate(form); setErrors(e); if(Object.keys(e).length){ setStatus('Controlla i campi evidenziati'); return }
    try{
      setStatus('Invio in corso…')
      const res = await fetch('/api/companies',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
      if(!res.ok) throw new Error(await res.text()||'Errore salvataggio')
      setStatus('✅ Inviato!')
      setForm({legalName:'',vat:'',contactName:'',email:'',phone:'',serviceAreas:'',skills:'',province:'',city:'',lat:null,lng:null})
      setErrors({})
    }catch(err:any){ setStatus('❌ '+(err.message||'Errore imprevisto')) }
  }

  const wrap={display:'grid',gap:12} as const
  const grid={display:'grid',gap:12,gridTemplateColumns:'repeat(2,minmax(0,1fr))'} as const
  const label={display:'grid',gap:6,fontSize:14 as const}
  const inputStyle={padding:'10px 12px',border:'1px solid #dcdcdc',borderRadius:8,fontSize:14 as const,outline:'none'}
  const btn={padding:'10px 14px',borderRadius:8,border:'none',background:'#111827',color:'#fff',cursor:'pointer'}
  const card={background:'#fff',padding:16,borderRadius:12,boxShadow:'0 2px 10px rgba(0,0,0,.05)'}
  const lead={fontSize:14 as const,color:'#444'}
  const errorStyle={color:'#b00020',fontSize:12 as const}

  return (
    <form onSubmit={onSubmit} style={{...wrap, ...card}}>
      <div style={grid}>
        <label style={label}>Ragione sociale *
          <input style={{...inputStyle, borderColor: errors.legalName?'#e33':'#dcdcdc', background: errors.legalName?'#fff6f6':'#fff'}}
                 value={form.legalName} onChange={e=>set('legalName',e.target.value)} />
          {errors.legalName && <small style={errorStyle}>{errors.legalName}</small>}
        </label>

        <label style={label}>P. IVA
          <input style={inputStyle} value={form.vat||''} onChange={e=>set('vat',e.target.value)} />
        </label>

        <label style={label}>Referente *
          <input style={{...inputStyle, borderColor: errors.contactName?'#e33':'#dcdcdc', background: errors.contactName?'#fff6f6':'#fff'}}
                 value={form.contactName} onChange={e=>set('contactName',e.target.value)} />
          {errors.contactName && <small style={errorStyle}>{errors.contactName}</small>}
        </label>

        <label style={label}>Email *
          <input type="email" style={{...inputStyle, borderColor: errors.email?'#e33':'#dcdcdc', background: errors.email?'#fff6f6':'#fff'}}
                 value={form.email} onChange={e=>set('email',e.target.value)} />
          {errors.email && <small style={errorStyle}>{errors.email}</small>}
        </label>

        <label style={label}>Telefono
          <input style={inputStyle} value={form.phone||''} onChange={e=>set('phone',e.target.value)} />
        </label>

        <label style={label}>Aree di servizio (sigle) *
          <input style={{...inputStyle, borderColor: errors.serviceAreas?'#e33':'#dcdcdc', background: errors.serviceAreas?'#fff6f6':'#fff'}}
                 value={form.serviceAreas} onChange={e=>set('serviceAreas',e.target.value)} />
          {errors.serviceAreas && <small style={errorStyle}>{errors.serviceAreas}</small>}
        </label>

        <label style={{...label, gridColumn:'1/-1'}}>Competenze principali *
          <input style={{...inputStyle, borderColor: errors.skills?'#e33':'#dcdcdc', background: errors.skills?'#fff6f6':'#fff'}}
                 value={form.skills} onChange={e=>set('skills',e.target.value)} />
          {errors.skills && <small style={errorStyle}>{errors.skills}</small>}
        </label>

        <label style={label}>Provincia
          <input style={{...inputStyle, borderColor: errors.province?'#e33':'#dcdcdc', background: errors.province?'#fff6f6':'#fff'}}
                 value={form.province||''} onChange={e=>set('province',e.target.value.toUpperCase())} />
          {errors.province && <small style={errorStyle}>{errors.province}</small>}
        </label>

        <label style={label}>Città
          <input style={inputStyle} value={form.city||''} onChange={e=>set('city',e.target.value)} />
        </label>

        <label style={label}>Lat
          <input style={{...inputStyle, borderColor: errors.lat?'#e33':'#dcdcdc', background: errors.lat?'#fff6f6':'#fff'}}
                 value={form.lat??''} onChange={e=>set('lat',toNumOrNull(e.target.value))} inputMode="decimal" pattern="[0-9.,-]*" />
          {errors.lat && <small style={errorStyle}>{errors.lat}</small>}
        </label>

        <label style={label}>Lng
          <input style={{...inputStyle, borderColor: errors.lng?'#e33':'#dcdcdc', background: errors.lng?'#fff6f6':'#fff'}}
                 value={form.lng??''} onChange={e=>set('lng',toNumOrNull(e.target.value))} inputMode="decimal" pattern="[0-9.,-]*" />
          {errors.lng && <small style={errorStyle}>{errors.lng}</small>}
        </label>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button style={btn} type="submit">Invia candidatura</button>
        {status && <span style={lead}>{status}</span>}
      </div>
    </form>
  )
}
