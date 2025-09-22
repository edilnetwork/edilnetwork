// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function needsAdminAuth(pathname: string) {
  // protegge tutte le pagine /admin e, se vuoi, anche /files
  return pathname.startsWith('/admin')
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!needsAdminAuth(pathname)) return NextResponse.next()

  const user = process.env.ADMIN_USER || 'admin'
  const pass = process.env.ADMIN_PASS || 'admin'

  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Basic ')) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
    })
  }

  const [u, p] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':')
  if (u !== user || p !== pass) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'], // applica il middleware a /admin
}
