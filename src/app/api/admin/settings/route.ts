import { NextResponse } from 'next/server'
import { loadSettings, saveSettings } from '@/lib/cms'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    await requireAuth()
    const settings = await loadSettings()
    return NextResponse.json({ settings })
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth()
    const incoming = await request.json() as any
    const current = await loadSettings()
    const merged = { ...current, ...incoming }
    await saveSettings(merged)
    return NextResponse.json({ success: true, settings: merged })
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


