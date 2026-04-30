import { createClient } from '@/lib/supabase/server'
import ReservationsClient from '@/components/reservations/ReservationsClient'

export default async function ReservationsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user!.id).single()
  const cid = company!.id
  const [{ data: reservations }, { data: items }, { data: clients }] = await Promise.all([
    supabase.from('reservations').select('*, client:clients(id,name), item:items(id,name,emoji,price_per_day)')
      .eq('company_id', cid).order('created_at', { ascending: false }),
    supabase.from('items').select('id,name,emoji,price_per_day').eq('company_id', cid),
    supabase.from('clients').select('id,name').eq('company_id', cid),
  ])
  return <ReservationsClient reservations={reservations||[]} items={items||[]} clients={clients||[]} />
}
