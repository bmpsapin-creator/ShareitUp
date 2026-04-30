import { createClient } from '@/lib/supabase/server'
import ClientsClient from '@/components/clients/ClientsClient'

export default async function ClientsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user!.id).single()
  const [{ data: clients }, { data: reservations }] = await Promise.all([
    supabase.from('clients').select('*').eq('company_id', company!.id).order('name'),
    supabase.from('reservations').select('client_id, total').eq('company_id', company!.id),
  ])
  return <ClientsClient clients={clients||[]} reservations={reservations||[]} />
}
