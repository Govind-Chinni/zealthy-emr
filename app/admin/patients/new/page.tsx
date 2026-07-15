import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PatientForm from '@/components/admin/PatientForm'

export default function NewPatientPage() {
  return (
    <div className="max-w-lg">
      <Link
        href="/admin"
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to patients
      </Link>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Create New Patient
        </h1>
        <PatientForm />
      </div>
    </div>
  )
}