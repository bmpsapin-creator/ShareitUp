import { createClient } from '@/lib/supabase/server'
import InventoryClient from '@/components/inventory/InventoryClient'

export default async function InventoryPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user!.id).single()
  const { data: items } = await supabase.from('items').select('*').eq('company_id', company!.id).order('created_at')
  const { data: reservations } = await supabase.from('reservations').select('item_id, total').eq('company_id', company!.id)

  return <InventoryClient items={items || []} reservations={reservations || []} />
}
