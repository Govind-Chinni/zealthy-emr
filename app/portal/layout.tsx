import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import PortalNav from '@/components/portal/PortalNav'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/')

  return (
    <div className="min-h-screen bg-gray-50">
      <PortalNav userName={user.name} />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}