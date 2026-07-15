import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, Pill, Mail } from 'lucide-react'
import AppointmentSection from '@/components/admin/AppointmentSection'
import PrescriptionSection from '@/components/admin/PrescriptionSection'
import EditPatientForm from '@/components/admin/EditPatientForm'

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const patient = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    include: {
      appointments: { orderBy: { datetime: 'asc' } },
      prescriptions: { orderBy: { refillOn: 'asc' } },
    },
  })

  if (!patient) notFound()

  const serialized = {
    ...patient,
    createdAt: patient.createdAt.toISOString(),
    appointments: patient.appointments.map((a: any) => ({
      ...a,
      datetime: a.datetime.toISOString(),
      endsOn: a.endsOn?.toISOString() ?? null,
      createdAt: a.createdAt.toISOString(),
    })),
    prescriptions: patient.prescriptions.map((p: any) => ({
      ...p,
      refillOn: p.refillOn.toISOString(),
      createdAt: p.createdAt.toISOString(),
    })),
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin"
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to patients
      </Link>

      {/* Patient header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 font-bold text-2xl">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {patient.name}
              </h1>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-0.5">
                <Mail className="h-3.5 w-3.5" />
                {patient.email}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Patient since {format(patient.createdAt, 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex gap-4 text-center">
            <div className="bg-indigo-50 rounded-xl px-4 py-2">
              <Calendar className="h-4 w-4 text-indigo-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-indigo-700">
                {patient.appointments.length}
              </p>
              <p className="text-xs text-indigo-500">Appointments</p>
            </div>
            <div className="bg-green-50 rounded-xl px-4 py-2">
              <Pill className="h-4 w-4 text-green-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-700">
                {patient.prescriptions.length}
              </p>
              <p className="text-xs text-green-500">Prescriptions</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">
            Edit Patient Info
          </h2>
          <EditPatientForm
            patient={{
              id: patient.id,
              name: patient.name,
              email: patient.email,
            }}
          />
        </div>
      </div>

      <AppointmentSection
        patientId={patient.id}
        appointments={serialized.appointments}
      />

      <PrescriptionSection
        patientId={patient.id}
        prescriptions={serialized.prescriptions}
      />
    </div>
  )
}