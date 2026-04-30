'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Company } from '@/lib/types'

const TABS = [
  { href: '/dashboard',    label: 'Dashboard' },
  { href: '/inventory',    label: 'Inventário' },
  { href: '/reservations', label: 'Reservas' },
  { href: '/clients',      label: 'Clientes' },
  { href: '/catalog-preview', label: 'Catálogo' },
  { href: '/settings',     label: 'Definições' },
]

export default function NavBar({ company, userEmail }: { company: Company | null; userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function logout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <nav className="bg-navy sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-14 gap-2">
          <span className="text-white font-bold text-lg mr-4 whitespace-nowrap">
            Aluga<span className="text-teal">.pt</span>
            <span className="text-gray-500 text-xs font-normal ml-2">SaaS</span>
          </span>
          <div className="flex overflow-x-auto flex-1">
            {TABS.map(t => (
              <Link key={t.href} href={t.href}
                className={`px-4 h-14 flex items-center text-sm whitespace-nowrap border-b-2 transition-colors ${
                  pathname === t.href
                    ? 'text-white border-teal'
                    : 'text-gray-400 border-transparent hover:text-gray-200'
                }`}>
                {t.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 ml-2 flex-shrink-0">
            <span className="text-gray-400 text-xs hidden md:block truncate max-w-32">
              {company?.name || userEmail}
            </span>
            <button onClick={logout}
              className="text-gray-400 hover:text-white text-xs border border-gray-600 rounded px-3 py-1.5 transition">
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
