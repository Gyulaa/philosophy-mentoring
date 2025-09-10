import { NextResponse } from 'next/server'

// Simple admin password (in production, use proper authentication)
const ADMIN_PASSWORD = 'FiloMento2025Admin!'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Set authentication cookie
    const response = NextResponse.json({ success: true })
    
    // Set secure cookie for admin session
    response.cookies.set('admin-auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}