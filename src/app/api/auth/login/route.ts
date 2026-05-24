import { NextResponse } from 'next/server'
import { computeToken } from '@/lib/auth'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

// In-memory rate limiter: 5 attempts per IP per 10 minutes
const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 10 * 60 * 1000

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'

    const now = Date.now()
    const record = loginAttempts.get(ip)

    if (record && now < record.resetAt) {
      if (record.count >= MAX_ATTEMPTS) {
        return NextResponse.json({ error: 'Too many attempts, try again later' }, { status: 429 })
      }
      record.count++
    } else {
      loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    }

    const { password } = await request.json()

    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Correct password — clear the rate limit record
    loginAttempts.delete(ip)

    const token = computeToken(ADMIN_PASSWORD)
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin-auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}