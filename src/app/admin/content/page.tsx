"use client"

import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import type { PageContent, ContentSection } from '@/lib/cms'

type ContentMap = Record<string, PageContent>

export default function AdminContentEditor() {
  const [pages, setPages] = useState<PageContent[]>([])
  const [contentMap, setContentMap] = useState<ContentMap>({})
  const [selectedId, setSelectedId] = useState<string>('')
  const [draft, setDraft] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [lastAddedId, setLastAddedId] = useState<string>('')
  const [newPageId, setNewPageId] = useState('')
  const [newPageTitle, setNewPageTitle] = useState('')

  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/admin/content')
        if (!res.ok) {
          throw new Error('Nem sikerült betölteni a tartalmat.')
        }
        const data = await res.json() as { pages: PageContent[] }
        setPages(data.pages)
        const map: ContentMap = {}
        for (const p of data.pages) map[p.id] = p
        setContentMap(map)
        if (!selectedId && data.pages.length > 0) {
          setSelectedId(data.pages[0].id)
          setDraft(structuredClone(data.pages[0]))
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ismeretlen hiba történt')
      } finally {
        setLoading(false)
      }
    }

    fetchPages()
  }, [])

  useEffect(() => {
    if (!selectedId) return
    const page = contentMap[selectedId]
    if (page) setDraft(structuredClone(page))
  }, [selectedId])

  const handleSectionChange = (sectionIndex: number, changes: Partial<ContentSection>) => {
    if (!draft) return
    const nextSections = draft.sections.map((s, i) => i === sectionIndex ? { ...s, ...changes } : s)
    setDraft({ ...draft, sections: nextSections })
  }

  const handleTitleChange = (value: string) => {
    if (!draft) return
    setDraft({ ...draft, title: value })
  }

  const handleRemoveSection = (sectionIndex: number) => {
    if (!draft) return
    const nextSections = draft.sections.filter((_, i) => i !== sectionIndex)
    setDraft({ ...draft, sections: nextSections })
  }

  const handleMoveUp = (sectionIndex: number) => {
    if (!draft || sectionIndex <= 0) return
    const next = [...draft.sections]
    const temp = next[sectionIndex - 1]
    next[sectionIndex - 1] = next[sectionIndex]
    next[sectionIndex] = temp
    setDraft({ ...draft, sections: next })
  }

  const handleMoveDown = (sectionIndex: number) => {
    if (!draft || sectionIndex >= draft.sections.length - 1) return
    const next = [...draft.sections]
    const temp = next[sectionIndex + 1]
    next[sectionIndex + 1] = next[sectionIndex]
    next[sectionIndex] = temp
    setDraft({ ...draft, sections: next })
  }

  const [newType, setNewType] = useState<ContentSection['type']>('text')

  const handleAddSection = () => {
    if (!draft) return
    const idBase = `${newType}-${Date.now()}`
    const base: ContentSection = { id: idBase, type: newType }
    let section: ContentSection = base
    if (newType === 'hero') {
      section = { ...base, title: 'Új hős', subtitle: '' }
    } else if (newType === 'text') {
      section = { ...base, title: 'Új szekció', content: '' }
    } else if (newType === 'highlight') {
      section = { ...base, title: 'Kiemelt', content: '', isHighlighted: true }
    } else if (newType === 'info-box') {
      section = { ...base, content: '' }
    } else if (newType === 'button') {
      section = { ...base, buttonText: 'Gomb', buttonLink: '/' }
    } else if (newType === 'embed') {
      section = { ...base, title: 'Beágyazott űrlap', embedUrl: '', height: 1880 }
    } else if (newType === 'image') {
      section = { ...base, title: 'Kép', imageUrl: '', description: '', imageWidth: 640, imageHeight: 360 }
    }
    setDraft({ ...draft, sections: [...draft.sections, section] })
    setLastAddedId(section.id)
  }

  const handleSave = async () => {
    if (!draft) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const updatedMap: ContentMap = { ...contentMap, [draft.id]: draft }
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMap)
      })
      if (!res.ok) throw new Error('Mentés sikertelen')
      setContentMap(updatedMap)
      setSuccess('Sikeresen mentve.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ismeretlen hiba a mentésnél')
    } finally {
      setSaving(false)
    }
  }

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
      const res = await fetch('/api/admin/content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated)
      })
      if (!res.ok) throw new Error('Mentés sikertelen')
      setContentMap(updated)
      setPages(Object.values(updated))
      setSelectedId(id)
      setDraft(structuredClone(newPage))
      setNewPageId(''); setNewPageTitle('')
      setSuccess('Új oldal létrehozva')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Hiba az oldal létrehozásakor')
    }
  }

  const handleDeletePage = async () => {
    if (!selectedPage) return
    const id = selectedPage.id
    const { [id]: _, ...rest } = contentMap
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rest)
      })
      if (!res.ok) throw new Error('Törlés sikertelen')
      setContentMap(rest)
      setPages(Object.values(rest))
      const first = Object.values(rest)[0]
      setSelectedId(first ? first.id : '')
      setDraft(first ? structuredClone(first) : null)
      setSuccess('Oldal törölve')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Hiba az oldal törlésekor')
    }
  }

  const selectedPage = useMemo(() => draft, [draft])

  return (
    <AdminLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Tartalom szerkesztése</h1>
          </div>

          {loading && (
            <div className="text-gray-600">Betöltés…</div>
          )}

          {!loading && error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          {!loading && success && (
            <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">{success}</div>
          )}

          {!loading && pages.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-700">Oldal</label>
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                >
                  {pages.map((p) => (
                    <option key={p.id} value={p.id}>{p.title} ({p.id})</option>
                  ))}
                </select>
                <button
                  onClick={handleSave}
                  disabled={!selectedPage || saving}
                  className="ml-auto inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? 'Mentés…' : 'Mentés'}
                </button>
              </div>

              {selectedPage && (
                <div className="bg-white shadow rounded-lg p-5 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Aktuális oldal: <span className="font-medium">{selectedPage.id}</span></div>
                    <button onClick={handleDeletePage} className="text-xs px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700">Oldal törlése</button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Oldal címe</label>
                    <input
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      value={selectedPage.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-700">Új szekció típusa</label>
                    <select
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as ContentSection['type'])}
                    >
                      <option value="hero">hero</option>
                      <option value="text">text</option>
                      <option value="highlight">highlight</option>
                      <option value="info-box">info-box</option>
                      <option value="button">button</option>
                      <option value="embed">embed</option>
                      <option value="image">image</option>
                    </select>
                    <button
                      onClick={handleAddSection}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      Szekció hozzáadása
                    </button>
                  </div>

                  <div className="space-y-6">
                    {selectedPage.sections.map((section, idx) => {
                      const isNew = section.id === lastAddedId
                      return (
                        <div key={section.id}>
                          {isNew && <div className="border-t border-gray-200 mb-6"></div>}
                          <div className={`border rounded-md p-4 ${isNew ? 'mt-6' : ''}`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-sm font-medium text-gray-900">Szekció: {section.type}</div>
                              <div className="flex items-center gap-3">
                                <div className="text-xs text-gray-500">ID: {section.id}</div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleMoveUp(idx)}
                                    className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
                                    disabled={idx === 0}
                                  >
                                    Fel
                                  </button>
                                  <button
                                    onClick={() => handleMoveDown(idx)}
                                    className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
                                    disabled={idx === selectedPage.sections.length - 1}
                                  >
                                    Le
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleRemoveSection(idx)}
                                  className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                                >
                                  Törlés
                                </button>
                              </div>
                            </div>

                            {section.type !== 'button' && (
                              <div className="mb-3">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Cím</label>
                                <input
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                  value={section.title || ''}
                                  onChange={(e) => handleSectionChange(idx, { title: e.target.value })}
                                />
                              </div>
                            )}

                            {section.type === 'hero' && (
                              <div className="mb-3">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Alcím</label>
                                <input
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                  value={section.subtitle || ''}
                                  onChange={(e) => handleSectionChange(idx, { subtitle: e.target.value })}
                                />
                              </div>
                            )}

                            {['text', 'highlight', 'info-box'].includes(section.type) && (
                              <div className="mb-3">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Tartalom</label>
                                <textarea
                                  className="w-full h-36 border border-gray-300 rounded-md px-3 py-2 text-sm"
                                  value={section.content || ''}
                                  onChange={(e) => handleSectionChange(idx, { content: e.target.value })}
                                />
                              </div>
                            )}

                            {section.type === 'highlight' && (
                              <div className="mb-3 flex items-center gap-2">
                                <input
                                  id={`hl-${idx}`}
                                  type="checkbox"
                                  className="h-4 w-4"
                                  checked={!!section.isHighlighted}
                                  onChange={(e) => handleSectionChange(idx, { isHighlighted: e.target.checked })}
                                />
                                <label htmlFor={`hl-${idx}`} className="text-xs text-gray-700">Kiemelt</label>
                              </div>
                            )}

                            {section.type === 'button' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Gomb szöveg</label>
                                  <input
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                    value={section.buttonText || ''}
                                    onChange={(e) => handleSectionChange(idx, { buttonText: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Gomb link</label>
                                  <input
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                    value={section.buttonLink || ''}
                                    onChange={(e) => handleSectionChange(idx, { buttonLink: e.target.value })}
                                  />
                                </div>
                              </div>
                            )}

                            {section.type === 'embed' && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Beágyazott URL</label>
                                  <input
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                    placeholder="https://docs.google.com/forms/..."
                                    value={section.embedUrl || ''}
                                    onChange={(e) => handleSectionChange(idx, { embedUrl: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Magasság (px)</label>
                                  <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                    value={section.height ?? 1880}
                                    onChange={(e) => handleSectionChange(idx, { height: Number(e.target.value || 0) })}
                                  />
                                </div>
                              </div>
                            )}

                            {section.type === 'image' && (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Kép URL</label>
                                  <div className="flex gap-2">
                                    <input
                                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                                      placeholder="https://.../image.jpg"
                                      value={section.imageUrl || ''}
                                      onChange={(e) => handleSectionChange(idx, { imageUrl: e.target.value })}
                                    />
                                    <label className="inline-flex items-center px-3 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0]
                                          if (!file) return
                                          const form = new FormData()
                                          form.append('file', file)
                                          try {
                                            const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
                                            if (!res.ok) throw new Error('Feltöltés sikertelen')
                                            const data = await res.json() as { url: string }
                                            handleSectionChange(idx, { imageUrl: data.url })
                                          } catch (err) {
                                            console.error(err)
                                          } finally {
                                            e.currentTarget.value = ''
                                          }
                                        }}
                                      />
                                      Feltöltés
                                    </label>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Szélesség (px)</label>
                                    <input
                                      type="number"
                                      min={1}
                                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                      value={section.imageWidth ?? 640}
                                      onChange={(e) => handleSectionChange(idx, { imageWidth: Number(e.target.value || 0) })}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Magasság (px) – opcionális</label>
                                    <input
                                      type="number"
                                      min={0}
                                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                      value={section.imageHeight ?? ''}
                                      onChange={(e) => handleSectionChange(idx, { imageHeight: e.target.value === '' ? undefined : Number(e.target.value) })}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Rövid leírás (kép alatt szürkével)</label>
                                  <input
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                    placeholder="Rövid leírás..."
                                    value={section.description || ''}
                                    onChange={(e) => handleSectionChange(idx, { description: e.target.value })}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}


