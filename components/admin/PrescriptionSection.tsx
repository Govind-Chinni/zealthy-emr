'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Pill, Plus, Pencil, Trash2, RefreshCw } from 'lucide-react'
import { Prescription } from '@/types'

interface Props {
  patientId: number
  prescriptions: Prescription[]
}

const EMPTY = {
  medication: '',
  dosage: '',
  quantity: '1',
  refillOn: '',
  refillSchedule: 'monthly',
}

export default function PrescriptionSection({ patientId, prescriptions }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Prescription | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [medications, setMedications] = useState<string[]>([])
  const [dosages, setDosages] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/medications')
      .then((r) => r.json())
      .then((data) => {
        setMedications(data.medications.map((m: { name: string }) => m.name))
        setDosages(data.dosages.map((d: { value: string }) => d.value))
      })
  }, [])

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setError('')
    setOpen(true)
  }

  function openEdit(rx: Prescription) {
    setEditing(rx)
    setForm({
      medication: rx.medication,
      dosage: rx.dosage,
      quantity: String(rx.quantity),
      refillOn: rx.refillOn.slice(0, 10),
      refillSchedule: rx.refillSchedule,
    })
    setError('')
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const body = {
        ...(editing ? {} : { userId: patientId }),
        ...form,
      }

      const url = editing
        ? `/api/prescriptions/${editing.id}`
        : '/api/prescriptions'
      const method = editing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save')
        return
      }

      setOpen(false)
      router.refresh()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this prescription?')) return
    await fetch(`/api/prescriptions/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  const inputClass =
    'w-full h-9 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Pill className="h-4 w-4 text-green-500" />
            Prescriptions
            <span className="text-sm font-normal text-gray-400">
              ({prescriptions.length})
            </span>
          </h2>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>

        {prescriptions.length === 0 ? (
          <div className="py-10 text-center text-gray-400">
            <Pill className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No prescriptions on file</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {prescriptions.map((rx) => (
              <li key={rx.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">
                    {rx.medication}{' '}
                    <span className="text-gray-400 font-normal">
                      {rx.dosage}
                    </span>
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="text-xs text-gray-500">Qty: {rx.quantity}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <RefreshCw className="h-3 w-3" />
                      Refill:{' '}
                      {format(new Date(rx.refillOn), 'MMM d, yyyy')} ·{' '}
                      {rx.refillSchedule}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(rx)}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(rx.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editing ? 'Edit Prescription' : 'New Prescription'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Medication
                </label>
                <select
                  className={inputClass}
                  value={form.medication}
                  onChange={(e) => set('medication', e.target.value)}
                  required
                >
                  <option value="">Select medication...</option>
                  {medications.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Dosage
                  </label>
                  <select
                    className={inputClass}
                    value={form.dosage}
                    onChange={(e) => set('dosage', e.target.value)}
                    required
                  >
                    <option value="">Select dosage...</option>
                    {dosages.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    className={inputClass}
                    value={form.quantity}
                    onChange={(e) => set('quantity', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Refill Date
                </label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.refillOn}
                  onChange={(e) => set('refillOn', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Refill Schedule
                </label>
                <select
                  className={inputClass}
                  value={form.refillSchedule}
                  onChange={(e) => set('refillSchedule', e.target.value)}
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-9 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors"
                >
                  {loading
                    ? 'Saving...'
                    : editing
                    ? 'Save Changes'
                    : 'Add Prescription'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="h-9 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}