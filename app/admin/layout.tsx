import Link from 'next/link'
import { Heart, Users, UserPlus } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-bold text-blue-600 text-lg"
            >
              <Heart className="h-5 w-5" />
              Zealthy{' '}
              <span className="text-gray-400 font-normal text-sm ml-1">
                EMR Admin
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                <Users className="h-4 w-4" />
                Patients
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/patients/new"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-2 rounded-md transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">New Patient</span>
            </Link>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              Patient Portal →
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}