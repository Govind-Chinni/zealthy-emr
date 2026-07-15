import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { expandRecurring, upcomingRefills } from '@/lib/recurrence'
import { addDays, format, isToday, isTomorrow } from 'date-fns'
import {
  Calendar, Pill, User, ChevronRight, Clock, AlertCircle,
} from 'lucide-react'

function formatOccurrenceDate(date: Date): string {
  if (isToday(date)) return `Today at ${format(date, 'h:mm a')}`
  if (isTomorrow(date)) return `Tomorrow at ${format(date, 'h:mm a')}`
  return format(date, 'EEE, MMM d · h:mm a')
}

export default async function PortalDashboard() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/')

  const user = await prisma.user.findUnique({
    where: { id: currentUser.userId },
    include: {
      appointments: { orderBy: { datetime: 'asc' } },
      prescriptions: { orderBy: { refillOn: 'asc' } },
    },
  })

  if (!user) redirect('/')

  const today = new Date()
  const in7Days = addDays(today, 7)
  const in3Months = addDays(today, 90)

  const appointmentsSerialized = user.appointments.map((a: any) => ({
    ...a,
    datetime: a.datetime.toISOString(),
    endsOn: a.endsOn?.toISOString() ?? null,
    createdAt: a.createdAt.toISOString(),
  }))

  const prescriptionsSerialized = user.prescriptions.map((p: any) => ({
    ...p,
    refillOn: p.refillOn.toISOString(),
    createdAt: p.createdAt.toISOString(),
  }))

  const upcomingAppointments = expandRecurring(
    appointmentsSerialized,
    today,
    in7Days
  )

  const upcomingRxRefills = upcomingRefills(
    prescriptionsSerialized,
    today,
    in7Days
  )

  const allUpcoming = expandRecurring(
    appointmentsSerialized,
    today,
    in3Months
  )

  const hour = today.getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}, {user.name.split(' ')[0]}
        </h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s your health summary for the next 7 days
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Patient Info
            </span>
          </div>
          <p className="font-semibold text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-xs text-gray-400 mt-1">
            Member since {format(user.createdAt, 'MMM yyyy')}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Appointments
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {upcomingAppointments.length}
          </p>
          <p className="text-sm text-gray-500">in the next 7 days</p>
          <p className="text-xs text-gray-400">
            {allUpcoming.length} in the next 3 months
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
              <Pill className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Refills Due
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {upcomingRxRefills.length}
          </p>
          <p className="text-sm text-gray-500">in the next 7 days</p>
          <p className="text-xs text-gray-400">
            {user.prescriptions.length} total prescriptions
          </p>
        </div>
      </div>

      {/* Upcoming appointments */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-500" />
            Upcoming Appointments
          </h2>
          <Link
            href="/portal/appointments"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            View all <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="px-5 py-10 text-center text-gray-400">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No appointments in the next 7 days</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {upcomingAppointments.map((appt, i) => (
              <li
                key={`${appt.id}-${i}`}
                className="flex items-center gap-4 px-5 py-3.5"
              >
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">
                    {appt.provider}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatOccurrenceDate(appt.occurrenceDate)}
                  </p>
                </div>
                {appt.repeatSchedule !== 'none' && (
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full capitalize">
                    {appt.repeatSchedule}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Upcoming refills */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Pill className="h-4 w-4 text-green-500" />
            Medication Refills Due
          </h2>
          <Link
            href="/portal/prescriptions"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            View all <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {upcomingRxRefills.length === 0 ? (
          <div className="px-5 py-10 text-center text-gray-400">
            <Pill className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No refills due in the next 7 days</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {upcomingRxRefills.map((rx: any) => (
              <li
                key={rx.id}
                className="flex items-center gap-4 px-5 py-3.5"
              >
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                  <AlertCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">
                    {rx.medication}{' '}
                    <span className="text-gray-400 font-normal">
                      {rx.dosage}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Refill due{' '}
                    {format(new Date(rx.refillOn), 'MMM d, yyyy')} · Qty:{' '}
                    {rx.quantity}
                  </p>
                </div>
                <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full capitalize">
                  {rx.refillSchedule}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}