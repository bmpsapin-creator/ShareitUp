import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NavBar from '@/components/NavBar'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/auth/login')

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_id', session.user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar company={company} userEmail={session.user.email || ''} />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
