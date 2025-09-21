import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Protezione semplice via header x-seed-secret === SEED_SECRET
export async function POST(req: Request) {
  const hdr = (req.headers as any).get('x-seed-secret') || ''
  if (!process.env.SEED_SECRET || hdr !== process.env.SEED_SECRET) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const existing = await prisma.company.count()
  if (existing > 0) {
    return NextResponse.json({ ok: true, message: 'Already seeded. Nothing to do.' })
  }

  const companies = [
    { legalName: 'Impresa Rossi srl', vat:'IT01234567890', contactName:'Marco Rossi', email:'rossi@example.com', phone:'+39 080 000 0001', serviceAreas:'BA, BR', skills:'cappotto, ponteggi', province:'BA', city:'Bari', lat:41.125, lng:16.866 },
    { legalName: 'Edil Puglia srl', vat:'IT09876543210', contactName:'Luca Bianchi', email:'bianchi@example.com', phone:'+39 080 000 0002', serviceAreas:'BR, TA', skills:'cartongesso, tinteggiature', province:'BR', city:'Fasano', lat:40.836, lng:17.356 },
    { legalName: 'Valle d’Itria Costruzioni', vat:'IT11122233344', contactName:'Giuseppe Neri', email:'neri@example.com', phone:'+39 080 000 0003', serviceAreas:'BA, BR, TA', skills:'ristrutturazioni, cappotto', province:'TA', city:'Martina Franca', lat:40.701, lng:17.335 },
    { legalName: 'Salento Edil snc', vat:'IT22233344455', contactName:'Antonio Greco', email:'greco@example.com', phone:'+39 0832 000 000', serviceAreas:'LE', skills:'impermeabilizzazioni, tetti', province:'LE', city:'Lecce', lat:40.352, lng:18.169 },
    { legalName: 'Gargano Ponteggi', vat:'IT33344455566', contactName:'Francesco De Luca', email:'deluca@example.com', phone:'+39 0881 000 000', serviceAreas:'FG', skills:'ponteggi, facciate', province:'FG', city:'Foggia', lat:41.462, lng:15.544 },
    { legalName: 'Ionio Impianti', vat:'IT44455566677', contactName:'Davide Serra', email:'serra@example.com', phone:'+39 099 000 000', serviceAreas:'TA, BR', skills:'impianti elettrici/idraulici', province:'TA', city:'Taranto', lat:40.469, lng:17.243 },
    { legalName: 'Barletta Trani Restauri', vat:'IT55566677788', contactName:'Paolo Conte', email:'conte@example.com', phone:'+39 0883 000 000', serviceAreas:'BT', skills:'restauro, consolidamenti', province:'BT', city:'Trani', lat:41.277, lng:16.416 },
    { legalName: 'Adriatica Cappotti', vat:'IT66677788899', contactName:'Stefano Marino', email:'marino@example.com', phone:'+39 080 000 0004', serviceAreas:'BA, BR', skills:'cappotto termico', province:'BR', city:'Ostuni', lat:40.732, lng:17.579 },
  ]

  for (const c of companies) {
    const created = await prisma.company.create({ data: c })
    // Aggiungi documenti base
    await prisma.document.create({
      data: { companyId: created.id, type:'DURC', filename:'durc.pdf', url:'/files/demo/durc.pdf', verified:true, expiresOn: new Date(Date.now()+1000*60*60*24*120) }
    })
    await prisma.document.create({
      data: { companyId: created.id, type:'RC', filename:'rc.pdf', url:'/files/demo/rc.pdf', verified:true, expiresOn: new Date(Date.now()+1000*60*60*24*200) }
    })
  }

  return NextResponse.json({ ok: true, created: companies.length })
}