import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { Users, ChevronRight, Calendar, Pill, UserPlus } from 'lucide-react'

export default async function AdminPage() {
  const patients = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: {
        select: { appointments: true, prescriptions: true },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            All Patients
          </h1>
          <p className="text-gray-500 mt-1">
            {patients.length} patient{patients.length !== 1 ? 's' : ''} in the system
          </p>
        </div>
        <Link
          href="/admin/patients/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          New Patient
        </Link>
      </div>

      {patients.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-gray-400">
          <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No patients yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_1fr_80px_80px_120px_40px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <span>Patient</span>
            <span>Email</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Appts
            </span>
            <span className="flex items-center gap-1">
              <Pill className="h-3 w-3" /> Rxs
            </span>
            <span>Joined</span>
            <span></span>
          </div>

          <ul className="divide-y divide-gray-100">
            {patients.map((patient: any) => (
              <li key={patient.id}>
                <Link
                  href={`/admin/patients/${patient.id}`}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_80px_80px_120px_40px] gap-2 sm:gap-4 px-5 py-4 hover:bg-blue-50 transition-colors items-center group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-sm shrink-0">
                      {patient.name.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-900">
                      {patient.name}
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">{patient.email}</span>
                  <span className="font-medium text-gray-700">
                    {patient._count.appointments}
                  </span>
                  <span className="font-medium text-gray-700">
                    {patient._count.prescriptions}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {format(patient.createdAt, 'MMM d, yyyy')}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}