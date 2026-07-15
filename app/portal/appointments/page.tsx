import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { expandRecurring } from '@/lib/recurrence'
import { addDays, format, startOfMonth, isSameMonth } from 'date-fns'
import { Calendar, Clock, Repeat } from 'lucide-react'

export default async function AppointmentsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/')

  const user = await prisma.user.findUnique({
    where: { id: currentUser.userId },
    include: { appointments: { orderBy: { datetime: 'asc' } } },
  })

  if (!user) redirect('/')

  const today = new Date()
  const in3Months = addDays(today, 90)

  const occurrences = expandRecurring(
    user.appointments.map((a: any) => ({
      ...a,
      datetime: a.datetime.toISOString(),
      endsOn: a.endsOn?.toISOString() ?? null,
      createdAt: a.createdAt.toISOString(),
    })),
    today,
    in3Months
  )

  // Group by month
  const grouped: Record<string, typeof occurrences> = {}
  for (const occ of occurrences) {
    const key = format(startOfMonth(occ.occurrenceDate), 'yyyy-MM')
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(occ)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Upcoming Appointments
        </h1>
        <p className="text-gray-500 mt-1">
          {occurrences.length} appointment
          {occurrences.length !== 1 ? 's' : ''} over the next 3 months
        </p>
      </div>

      {occurrences.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-gray-400">
          <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No upcoming appointments</p>
          <p className="text-sm mt-1">
            Your schedule is clear for the next 3 months
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([monthKey, appts]) => {
          const monthDate = new Date(monthKey + '-01')
          return (
            <div
              key={monthKey}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <h2 className="font-semibold text-gray-700">
                  {isSameMonth(monthDate, today) ? 'This Month · ' : ''}
                  {format(monthDate, 'MMMM yyyy')}
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    {appts.length} appointment
                    {appts.length !== 1 ? 's' : ''}
                  </span>
                </h2>
              </div>
              <ul className="divide-y divide-gray-50">
                {appts.map((appt, i) => (
                  <li
                    key={`${appt.id}-${i}`}
                    className="flex items-start gap-4 px-5 py-4"
                  >
                    <div className="text-center bg-indigo-50 rounded-xl px-3 py-2 min-w-[52px] shrink-0">
                      <p className="text-xs text-indigo-500 font-medium uppercase">
                        {format(appt.occurrenceDate, 'MMM')}
                      </p>
                      <p className="text-xl font-bold text-indigo-700 leading-none">
                        {format(appt.occurrenceDate, 'd')}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="font-semibold text-gray-900">
                        {appt.provider}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                        <Clock className="h-3.5 w-3.5" />
                        {format(appt.occurrenceDate, 'EEEE · h:mm a')}
                      </div>
                      {appt.repeatSchedule !== 'none' && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <Repeat className="h-3 w-3" />
                          Repeats {appt.repeatSchedule}
                          {appt.endsOn &&
                            ` · ends ${format(new Date(appt.endsOn), 'MMM d, yyyy')}`}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        })
      )}
    </div>
  )
}