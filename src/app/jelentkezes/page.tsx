import React from 'react'
import { getPageContent } from '@/lib/cms'
import DynamicPage from '@/components/DynamicPage'

export const dynamic = 'force-dynamic'

export default async function JelentkezesPage() {
  const pageContent = await getPageContent('jelentkezes')
  if (!pageContent) return null
  return <DynamicPage pageContent={pageContent} />
}