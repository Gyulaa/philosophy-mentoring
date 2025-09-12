import { getPageContent, loadSettings } from '@/lib/cms'
import DynamicPage from '@/components/DynamicPage'

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = (params.slug || '').replace(/^\/+|\/+$/g, '')
  // Resolve slug via navigation mapping first (href -> id), then fallback to slug-as-id
  const settings = await loadSettings()
  const matched = (settings.navigation || []).find(n => (n.href || '').replace(/^\/+|\/+$/g, '') === slug)
  const resolvedId = matched?.id || slug
  const pageContent = await getPageContent(resolvedId)
  if (!pageContent) {
    // Graceful empty render to avoid a confusing 404 layout
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Oldal nem található</h1>
          <p className="text-gray-600">A keresett oldal tartalma még nem lett létrehozva.</p>
        </div>
      </div>
    )
  }
  return <DynamicPage pageContent={pageContent} />
}


