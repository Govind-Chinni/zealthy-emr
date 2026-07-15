'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Heart, Calendar, Pill, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function PortalNav({ userName }: { userName: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const links = [
    { href: '/portal', label: 'Dashboard', icon: Heart },
    { href: '/portal/appointments', label: 'Appointments', icon: Calendar },
    { href: '/portal/prescriptions', label: 'Prescriptions', icon: Pill },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/portal"
            className="flex items-center gap-2 font-bold text-blue-600 text-lg"
          >
            <Heart className="h-5 w-5" />
            Zealthy
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{userName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden flex border-t border-gray-100">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium',
              pathname === href ? 'text-blue-700' : 'text-gray-500'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}