'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  patient: { id: number; name: string; email: string }
}

export default function EditPatientForm({ patient }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: patient.name,
    email: patient.email,
    password: '',
  })

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    setSuccess(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setSuccess(false)

    try {
      const body: Record<string, string> = {
        name: form.name,
        email: form.email,
      }
      if (form.password) body.password = form.password

      const res = await fetch(`/api/patients/${patient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Update failed')
        return
      }

      setSuccess(true)
      setForm((f) => ({ ...f, password: '' }))
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
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Name</label>
        <input
          className={inputClass}
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className={inputClass}
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type="text"
          className={inputClass}
          placeholder="Leave blank to keep current"
          value={form.password}
          onChange={(e) => set('password', e.target.value)}
        />
      </div>

      <div className="sm:col-span-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="h-8 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium rounded-md transition-colors"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        {success && (
          <span className="text-sm text-green-600 font-medium">
            ✓ Saved successfully
          </span>
        )}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </form>
  )
}