// app/api/companies/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs' // Prisma richiede Node runtime

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Campi obbligatori (minimi)
    const legalName = (body.legalName || '').trim()
    const contactName = (body.contactName || '').trim()
    const email = (body.email || '').trim()
    const serviceAreas = (body.serviceAreas || '').trim()
    const skills = (body.skills || '').trim()
    if (!legalName || !contactName || !email || !serviceAreas || !skills) {
      return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
    }

    // Normalizzazioni/facoltativi
    const vat = (body.vat || '').trim()
    const phone = (body.phone || '').trim()
    const province = body.province ? String(body.province).trim().toUpperCase() : null
    const city = body.city ? String(body.city).trim() : null
    const lat = body.lat === null || body.lat === undefined ? null : Number(body.lat)
    const lng = body.lng === null || body.lng === undefined ? null : Number(body.lng)

    const created = await prisma.company.create({
      data: {
        legalName, vat, contactName, email, phone,
        serviceAreas, skills, province, city, lat, lng,
      } as any,
    })

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 })
  } catch (err) {
    console.error('POST /api/companies error:', err)
    return new NextResponse('Errore server', { status: 500 })
  }
}
