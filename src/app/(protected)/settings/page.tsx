import { createClient } from '@/lib/supabase/server'
import SettingsClient from '@/components/settings/SettingsClient'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: company } = await supabase.from('companies').select('*').eq('owner_id', user!.id).single()
  return <SettingsClient company={company} userEmail={user!.email || ''} />
}
