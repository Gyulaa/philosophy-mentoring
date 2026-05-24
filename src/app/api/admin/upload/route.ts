import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { saveUploadFile } from '@/lib/cms'

export const runtime = 'nodejs'

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const ALLOWED_EXTENSIONS = /\.(jpe?g|png|webp|gif)$/i

function hasValidImageHeader(buf: Buffer): boolean {
  if (buf.length < 12) return false
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8
  const isPng  = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47
  const isGif  = buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46
  const isWebp = buf.slice(0, 4).toString('ascii') === 'RIFF' &&
                 buf.slice(8, 12).toString('ascii') === 'WEBP'
  return isJpeg || isPng || isGif || isWebp
}

export async function POST(request: Request) {
  try {
    await requireAuth()
    const form = await request.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    if (!ALLOWED_MIME_TYPES.has(file.type) || !ALLOWED_EXTENSIONS.test(file.name)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP, or GIF images are allowed' }, { status: 400 })
    }

    const bytes = Buffer.from(await file.arrayBuffer())

    if (!hasValidImageHeader(bytes)) {
      return NextResponse.json({ error: 'File content does not match an allowed image format' }, { status: 400 })
    }

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


