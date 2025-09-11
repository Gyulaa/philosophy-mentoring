import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { saveUploadFile } from '@/lib/cms'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    await requireAuth()
    const form = await request.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const bytes = Buffer.from(await file.arrayBuffer())
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const timestamp = Date.now()
    const relative = `public/uploads/${timestamp}_${safeName}`
    const { url, path } = await saveUploadFile(relative, bytes)

    return NextResponse.json({ url, path, filename: `${timestamp}_${safeName}` })
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


