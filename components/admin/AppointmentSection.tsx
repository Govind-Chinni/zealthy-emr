'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Calendar, Plus, Pencil, Trash2, Repeat } from 'lucide-react'
import { Appointment } from '@/types'

interface Props {
  patientId: number
  appointments: Appointment[]
}

const EMPTY = {
  provider: '',
  datetime: '',
  repeatSchedule: 'none',
  endsOn: '',
}

export default function AppointmentSection({ patientId, appointments }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Appointment | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setError('')
    setOpen(true)
  }

  function openEdit(appt: Appointment) {
    setEditing(appt)
    setForm({
      provider: appt.provider,
      datetime: appt.datetime.slice(0, 16),
      repeatSchedule: appt.repeatSchedule,
      endsOn: appt.endsOn ? appt.endsOn.slice(0, 10) : '',
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
        provider: form.provider,
        datetime: form.datetime,
        repeatSchedule: form.repeatSchedule,
        endsOn: form.endsOn || null,
      }

      const url = editing
        ? `/api/appointments/${editing.id}`
        : '/api/appointments'
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
    if (!confirm('Delete this appointment?')) return
    await fetch(`/api/appointments/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  const inputClass =
    'w-full h-9 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-500" />
            Appointments
            <span className="text-sm font-normal text-gray-400">
              ({appointments.length})
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

        {appointments.length === 0 ? (
          <div className="py-10 text-center text-gray-400">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No appointments scheduled</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {appointments.map((appt) => (
              <li
                key={appt.id}
                className="flex items-center gap-4 px-5 py-3.5"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">
                    {appt.provider}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(appt.datetime), 'MMM d, yyyy · h:mm a')}
                  </p>
                  {appt.repeatSchedule !== 'none' && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <Repeat className="h-3 w-3" />
                      Repeats {appt.repeatSchedule}
                      {appt.endsOn &&
                        ` · ends ${format(new Date(appt.endsOn), 'MMM d, yyyy')}`}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(appt)}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(appt.id)}
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
              {editing ? 'Edit Appointment' : 'New Appointment'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Provider Name
                </label>
                <input
                  className={inputClass}
                  placeholder="Dr. Jane Smith"
                  value={form.provider}
                  onChange={(e) => set('provider', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={form.datetime}
                  onChange={(e) => set('datetime', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Repeat Schedule
                </label>
                <select
                  className={inputClass}
                  value={form.repeatSchedule}
                  onChange={(e) => set('repeatSchedule', e.target.value)}
                >
                  <option value="none">One-time (no repeat)</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {form.repeatSchedule !== 'none' && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    End Recurring On (optional)
                  </label>
                  <input
                    type="date"
                    className={inputClass}
                    value={form.endsOn}
                    onChange={(e) => set('endsOn', e.target.value)}
                  />
                  <p className="text-xs text-gray-400">
                    Leave blank for indefinitely recurring
                  </p>
                </div>
              )}

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
                    : 'Create Appointment'}
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