import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_DATA = 'admin-session'

async function isValidToken(token: string, password: string): Promise<boolean> {
  try {
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    // Decode base64url → raw bytes
    const b64 = token.replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
    const sig = Uint8Array.from(atob(padded), c => c.charCodeAt(0))
    return await crypto.subtle.verify('HMAC', key, sig, enc.encode(SESSION_DATA))
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Let the login page through unconditionally
  if (pathname === '/admin/login' || pathname === '/admin') {
    return NextResponse.next()
  }

  const token = request.cookies.get('admin-auth')?.value
  const password = process.env.ADMIN_PASSWORD

  if (!token || !password || !(await isValidToken(token, password))) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Only run on admin UI pages — API routes handle their own auth
  matcher: ['/admin/:path+'],
}
