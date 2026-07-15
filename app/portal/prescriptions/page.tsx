import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { format, isPast, addDays } from 'date-fns'
import { Pill, RefreshCw, AlertTriangle } from 'lucide-react'

export default async function PrescriptionsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/')

  const user = await prisma.user.findUnique({
    where: { id: currentUser.userId },
    include: { prescriptions: { orderBy: { refillOn: 'asc' } } },
  })

  if (!user) redirect('/')

  const in7Days = addDays(new Date(), 7)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
        <p className="text-gray-500 mt-1">
          {user.prescriptions.length} active prescription
          {user.prescriptions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {user.prescriptions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-gray-400">
          <Pill className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No prescriptions on file</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {user.prescriptions.map((rx: any) => {
            const refillDate = new Date(rx.refillOn)
            const isOverdue = isPast(refillDate)
            const isDueSoon = !isOverdue && refillDate <= in7Days

            return (
              <div
                key={rx.id}
                className={`bg-white rounded-xl border p-5 ${
                  isOverdue
                    ? 'border-red-200 bg-red-50'
                    : isDueSoon
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isOverdue
                          ? 'bg-red-100'
                          : isDueSoon
                          ? 'bg-amber-100'
                          : 'bg-green-100'
                      }`}
                    >
                      {isOverdue || isDueSoon ? (
                        <AlertTriangle
                          className={`h-5 w-5 ${
                            isOverdue ? 'text-red-500' : 'text-amber-500'
                          }`}
                        />
                      ) : (
                        <Pill className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {rx.medication}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {rx.dosage} · Qty: {rx.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {isOverdue && (
                      <span className="inline-block bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        Overdue
                      </span>
                    )}
                    {isDueSoon && (
                      <span className="inline-block bg-amber-100 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        Due soon
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Next refill:{' '}
                    <span className="font-medium text-gray-700">
                      {format(refillDate, 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="capitalize">
                    Schedule:{' '}
                    <span className="font-medium text-gray-700">
                      {rx.refillSchedule}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}