import React from 'react'
import { getPageContent } from '@/lib/cms'
import DynamicPage from '@/components/DynamicPage'

export const dynamic = 'force-dynamic'

export default async function IntroPage() {
  let pageContent = await getPageContent('bemutatkozas')
  
  // If no content exists, use the default content structure
  if (!pageContent) {
    // This will trigger the creation of default content
    const { loadContent } = await import('@/lib/cms')
    const allContent = await loadContent()
    pageContent = allContent['bemutatkozas']
  }

  if (!pageContent) {
    // Fallback content in case something goes wrong
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Oldal betöltése...</h1>
          <p className="text-gray-600">A tartalom betöltése folyamatban van.</p>
        </div>
      </div>
    )
  }

  return <DynamicPage pageContent={pageContent} />
}