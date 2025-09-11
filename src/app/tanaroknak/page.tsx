import React from 'react'
import { getPageContent } from '@/lib/cms'
import DynamicPage from '@/components/DynamicPage'

export const dynamic = 'force-dynamic'

export default async function TanaroknakPage() {
  const pageContent = await getPageContent('tanaroknak')
  if (!pageContent) return null
  return <DynamicPage pageContent={pageContent} />
}