import { cookies } from 'next/headers'

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('admin-auth')
  return authCookie?.value === 'authenticated'
}

export async function requireAuth(): Promise<void> {
  const ok = await isAuthenticated()
  if (!ok) {
    throw new Error('Authentication required')
  }
}