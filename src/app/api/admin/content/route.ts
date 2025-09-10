import { NextResponse } from 'next/server'
import { loadContent, saveContent, getAllPages } from '@/lib/cms'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    requireAuth()
    const pages = await getAllPages()
    return NextResponse.json({ pages })
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    requireAuth()
    const content = await request.json()
    await saveContent(content)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}