"use client"

import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { PageContent } from '@/lib/cms'

export default function AdminDashboard() {
  const [pages, setPages] = useState<PageContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [creating, setCreating] = useState(false)
  const [newPageId, setNewPageId] = useState('')
  const [newPageTitle, setNewPageTitle] = useState('')

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch('/api/admin/content')
        if (response.ok) {
          const data = await response.json()
          setPages(data.pages)
        }
      } catch (error) {
        console.error('Error fetching pages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPages()
  }, [])

  const contentMap = useMemo(() => {
    const map: Record<string, PageContent> = {}
    for (const p of pages) map[p.id] = p
    return map
  }, [pages])

  const handleCreatePage = async () => {
    setError(''); setSuccess('')
    const id = newPageId.trim()
    const title = newPageTitle.trim() || newPageId.trim()
    if (!id) { setError('Adj meg egy oldal azonosítót'); return }
    if (contentMap[id]) { setError('Ez az oldal már létezik'); return }
    const newPage: PageContent = {
      id,
      title: title || id,
      sections: [ { id: 'hero', type: 'hero', title: title || id, subtitle: '' } ]
    }
    const updated = { ...contentMap, [id]: newPage }
    try {
      setCreating(true)
      const res = await fetch('/api/admin/content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated)
      })
      if (!res.ok) throw new Error('Mentés sikertelen')
      setPages(Object.values(updated))
      setNewPageId(''); setNewPageTitle('')
      setSuccess('Új oldal létrehozva')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Hiba az oldal létrehozásakor')
    } finally {
      setCreating(false)
    }
  }

  return (
    <AdminLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 font-sans">
            FiloMento Admin Dashboard
          </h1>
          
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 font-sans">
              Gyors Műveletek
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 font-sans">Tartalom szerkesztése</h3>
                  <p className="text-sm text-gray-500">A weboldal tartalmának módosítása</p>
                </div>
                <a
                  href="/admin/content"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Szerkesztés
                </a>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 font-sans">Új oldal létrehozása</h3>
                  <p className="text-sm text-gray-500">Gyorsan hozz létre egy új oldalt</p>
                </div>
                {error && (<div className="rounded bg-red-50 text-red-700 text-xs px-2 py-1">{error}</div>)}
                {success && (<div className="rounded bg-green-50 text-green-700 text-xs px-2 py-1">{success}</div>)}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    placeholder="azonosító (pl. kapcsolat)"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm font-sans"
                    value={newPageId}
                    onChange={(e) => setNewPageId(e.target.value)}
                  />
                  <input
                    placeholder="cím (opcionális)"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm font-sans"
                    value={newPageTitle}
                    onChange={(e) => setNewPageTitle(e.target.value)}
                  />
                  <button
                    onClick={handleCreatePage}
                    disabled={creating}
                    className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 font-sans"
                  >
                    {creating ? 'Létrehozás…' : 'Létrehozás'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📄</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Oldalak száma
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {loading ? '...' : pages.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">✅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Rendszer állapot
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Aktív
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </AdminLayout>
  )
}