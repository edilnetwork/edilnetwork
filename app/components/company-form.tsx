
'use client'

import { useState } from 'react'
import { z } from 'zod'

export default function CompanyForm(){
  const [status,setStatus] = useState('')

  async function submit(e: any){
    e.preventDefault()
    setStatus('Invio...')
    const form = new FormData(e.currentTarget)
    const body = Object.fromEntries(form.entries())
    const res = await fetch('/api/companies', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
    setStatus(res.ok ? 'Inviato! Ti contatteremo.' : 'Errore. Controlla i campi.')
    if(res.ok) e.currentTarget.reset()
  }

  async function geocode(e:any){
    e.preventDefault()
    const city=(document.querySelector('input[name=city]') as HTMLInputElement)?.value
    const province=(document.querySelector('input[name=province]') as HTMLInputElement)?.value
    const q = `${city||''} ${province||''} Puglia, Italia`.trim()
    const r = await fetch('/api/geocode', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ q }) })
    if(!r.ok) return alert('Geocoding non disponibile')
    const j = await r.json()
    if(j.found){
      ;(document.querySelector('input[name=lat]') as HTMLInputElement).value = String(j.lat)
      ;(document.querySelector('input[name=lng]') as HTMLInputElement).value = String(j.lng)
      alert('Posizione trovata: ' + j.formatted)
    } else alert('Località non trovata, prova a scrivere meglio.')
  }

  // Autocomplete Comuni Puglia
  async function suggestCities(e:any){
    const prov = (document.querySelector('input[name=province]') as HTMLInputElement)?.value || ''
    const q = e.target.value
    const url = `/api/places?q=${encodeURIComponent(q)}&prov=${encodeURIComponent(prov)}`
    const res = await fetch(url)
    const list = await res.json()
    const dl = document.getElementById('cities') as HTMLDataListElement
    dl.innerHTML = ''
    list.forEach((it:any)=>{
      const opt = document.createElement('option')
      opt.value = it.city
      opt.label = `${it.city} (${it.province})`
      dl.appendChild(opt)
    })
  }

  return (
    <form className="card" onSubmit={submit} style={{display:'grid',gap:12}}>
      <h3>Candida la tua impresa</h3>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <label>Ragione sociale* <input name="legalName" required /></label>
        <label>P.IVA* <input name="vat" required /></label>
        <label>Referente* <input name="contactName" required/></label>
        <label>Email* <input type="email" name="email" required/></label>
        <label>Telefono* <input name="phone" required/></label>
        <label>Provincia (sigle)* <input name="province" placeholder="BA, BR, TA..." /></label>
        <label>Comune/Città <input name="city" list="cities" placeholder="Es. Fasano" onInput={suggestCities}/></label>
        <datalist id="cities"></datalist>
        <label>Aree servite* <input name="serviceAreas" placeholder="BA, BR, TA..." required/></label>
        <label>Settori/competenze* <input name="skills" placeholder="cappotto, ponteggi, impianti..." required/></label>
        <label>Capacità <input name="capacity" placeholder="es. 2 squadre, ponteggiatori, ecc."/></label>
        <label>Latitudine <input name="lat" placeholder="40.84" /></label>
        <label>Longitudine <input name="lng" placeholder="17.34" /></label>
      </div>
      <div style={{display:'flex',gap:10}}>
        <button className="btn" type="submit">Invia candidatura</button>
        <button className="btn outline" onClick={geocode}>Geocodifica città/provincia</button>
      </div>
      {status && <p className="lead">{status}</p>}
    </form>
  )
}
