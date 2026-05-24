import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'crypto'

const SESSION_DATA = 'admin-session'

export function computeToken(password: string): string {
  return createHmac('sha256', password).update(SESSION_DATA).digest('base64url')
}

export async function isAuthenticated(): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('admin-auth')
  if (!authCookie?.value) return false
  try {
    const expected = Buffer.from(computeToken(password))
    const actual = Buffer.from(authCookie.value)
    return expected.length === actual.length && timingSafeEqual(expected, actual)
  } catch {
    return false
  }
}

export async function requireAuth(): Promise<void> {
  const ok = await isAuthenticated()
  if (!ok) {
    throw new Error('Authentication required')
  }
}