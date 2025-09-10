"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminIndex() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin/login')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-lg">Átirányítás...</div>
    </div>
  )
}