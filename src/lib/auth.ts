import { cookies } from 'next/headers'

export function isAuthenticated(): boolean {
  const cookieStore = cookies()
  const authCookie = cookieStore.get('admin-auth')
  return authCookie?.value === 'authenticated'
}

export function requireAuth() {
  if (!isAuthenticated()) {
    throw new Error('Authentication required')
  }
}