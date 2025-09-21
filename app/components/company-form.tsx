
'use client'

import { useState } from 'react'

type CompanyPayload = {
  legalName: string
  vat?: string
  contactName: string
  email: string
  phone?: string
  serviceAreas: string
  skills: string
  province?: string
  city?: string
  lat?: number | null
  lng?: number | null
}

type Errors = Partial<Record<keyof CompanyPayload, string>>

function isEmail(v: string) {
  // regex semplice e permissiva
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}
function toNumOrNull(v: string) {
  if (v.trim() === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

export default function CompanyForm() {
  const [form, setForm] = useState<CompanyPayload>({
    legalName: '',
    vat: '',
    contactName: '',
    email: '',
    phone: '',
    serviceAreas: '',
    skills: '',
    province: '',
    city: '',
    lat: null,
    lng: null,
  })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<string>('')

  function set<K extends keyof CompanyPayload>(key: K, value: CompanyPayload[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function validate(data: CompanyPayload): Errors {
    const e: Errors = {}
    if (!data.legalName.trim()) e.legalName = 'Ragione sociale obbligatoria'
    if (!data.contactName.trim()) e.contactName = 'Nome referente obbligatorio'
    if (!data.email.trim()) e.email = 'Email obbligatoria'
    else if (!isEmail(data.email)) e.email = 'Email non valida'
    if (!data.serviceAreas.trim()) e.serviceAreas = 'Aree di servizio obbligatorie (es. BA, BR)'
    if (!data.skills.trim()) e.skills = 'Competenze obbligatorie (es. cappotto, impianti)'
    // province facoltativa ma, se presente, max 2/3 lettere
    if (data.province && data.province.trim() && data.province.trim().length > 3) {
      e.province = 'Usa sigla provincia (es. BA, BR, TA)'
    }
    // lat/lng: se uno presente, valida entrambi numerici
    const latGiven = data.lat !== null && data.lat !== undefined
    const lngGiven = data.lng !== null && data.lng !== undefined
    if (latGiven !== lngGiven) {
      e.lat = 'Inserisci sia Lat che Lng (oppure lascia entrambi vuoti)'
      e.lng = 'Inserisci sia Lat che Lng (oppure lascia entrambi vuoti)'
    }
    return e
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setStatus('')
    const payload: CompanyPayload = {
      ...form,
      lat: form.lat ?? null,
      lng: form.lng ?? null,
    }
    const e = validate(payload)
    setErrors(e)
    if (Object.keys(e).length > 0) {
      setStatus('Controlla i campi evidenziati')
      return
    }
    try {
      setStatus('Invio in corso…')
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Errore salvataggio')
      }
      setStatus('✅ Inviato! Verrai ricontattato al più presto.')
      // reset soft, tieni provincia/city/skills se vuoi
      setForm({
        legalName: '',
        vat: '',
        contactName: '',
        email: '',
        phone: '',
        serviceAreas: '',
        skills: '',
        province: '',
        city: '',
        lat: null,
        lng: null,
      })
      setErrors({})
    } catch (err: any) {
      setStatus(`❌ ${err.message ?? 'Errore imprevisto'}`)
    }
  }

  return (
    <form onSubmit={onSubmit} className="card" style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <label>
          Ragione sociale *
          <input
            value={form.legalName}
            onChange={e => set('legalName', e.target.value)}
            placeholder="Edil Puglia S.r.l."
            aria-invalid={!!errors.legalName}
          />
          {errors.legalName && <small className="error">{errors.legalName}</small>}
        </label>

        <label>
          Partita IVA
          <input
            value={form.vat ?? ''}
            onChange={e => set('vat', e.target.value)}
            placeholder="IT01234567890"
          />
        </label>

        <label>
          Referente *
          <input
            value={form.contactName}
            onChange={e => set('contactName', e.target.value)}
            placeholder="Mario Rossi"
            aria-invalid={!!errors.contactName}
          />
          {errors.contactName && <small className="error">{errors.contactName}</small>}
        </label>

        <label>
          Email *
          <input
            value={form.email}
            onChange={e => set('email', e.target.value)}
            type="email"
            placeholder="nome@azienda.it"
            aria-invalid={!!errors.email}
          />
          {errors.email && <small className="error">{errors.email}</small>}
        </label>

        <label>
          Telefono
          <input
            value={form.phone ?? ''}
            onChange={e => set('phone', e.target.value)}
            placeholder="+39 333 1234567"
          />
        </label>

        <label>
          Aree di servizio (sigle) *
          <input
            value={form.serviceAreas}
            onChange={e => set('serviceAreas', e.target.value)}
            placeholder="BA, BR, TA"
            aria-invalid={!!errors.serviceAreas}
          />
          {errors.serviceAreas && <small className="error">{errors.serviceAreas}</small>}
        </label>

        <label style={{ gridColumn: '1 / -1' }}>
          Competenze principali *
          <input
            value={form.skills}
            onChange={e => set('skills', e.target.value)}
            placeholder="cappotto, cartongesso, impianti, tetti…"
            aria-invalid={!!errors.skills}
          />
          {errors.skills && <small className="error">{errors.skills}</small>}
        </label>

        <label>
          Provincia (sigla)
          <input
            value={form.province ?? ''}
            onChange={e => set('province', e.target.value.toUpperCase())}
            placeholder="BA"
            aria-invalid={!!errors.province}
          />
          {errors.province && <small className="error">{errors.province}</small>}
        </label>

        <label>
          Città
          <input
            value={form.city ?? ''}
            onChange={e => set('city', e.target.value)}
            placeholder="Martina Franca"
          />
        </label>

        <label>
          Lat
          <input
            value={form.lat ?? ''}
            onChange={e => set('lat', toNumOrNull(e.target.value))}
            placeholder="40.701"
            inputMode="decimal"
            pattern="[0-9.,-]*"
            aria-invalid={!!errors.lat}
          />
          {errors.lat && <small className="error">{errors.lat}</small>}
        </label>

        <label>
          Lng
          <input
            value={form.lng ?? ''}
            onChange={e => set('lng', toNumOrNull(e.target.value))}
            placeholder="17.335"
            inputMode="decimal"
            pattern="[0-9.,-]*"
            aria-invalid={!!errors.lng}
          />
          {errors.lng && <small className="error">{errors.lng}</small>}
        </label>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="btn" type="submit">Invia candidatura</button>
        {status && <span className="lead">{status}</span>}
      </div>

      <style jsx>{`
        .card {
          background: #fff;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,.05);
        }
        label { display: grid; gap: 6px; font-size: 14px; }
        input {
          padding: 10px 12px;
          border: 1px solid #dcdcdc;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
        }
        input[aria-invalid="true"] {
          border-color: #e33;
          background: #fff6f6;
        }
        .btn {
          padding: 10px 14px;
          border-radius: 8px;
          border: none;
          background: #111827;
          color: #fff;
          cursor: pointer;
        }
        .btn:hover { opacity: .9; }
        .lead { font-size: 14px; color: #444; }
        .error { color: #b00020; font-size: 12px; }
      `}</style>
    </form>
  )
}
