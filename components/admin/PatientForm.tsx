'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PatientForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create patient')
        return
      }

      router.push(`/admin/patients/${data.id}`)
      router.refresh()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full h-9 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Full Name</label>
        <input
          className={inputClass}
          placeholder="Jane Doe"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          className={inputClass}
          placeholder="jane@example.com"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="text"
          className={inputClass}
          placeholder="Set a password for this patient"
          value={form.password}
          onChange={(e) => set('password', e.target.value)}
          required
        />
        <p className="text-xs text-gray-400">
          The patient will use this to log in to the patient portal
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="h-9 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors"
        >
          {loading ? 'Creating...' : 'Create Patient'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="h-9 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}