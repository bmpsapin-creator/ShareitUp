'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { calcTotal } from '@/lib/utils'

async function getCompanyId() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data } = await supabase.from('companies').select('id').eq('owner_id', user.id).single()
  return { supabase, companyId: data?.id }
}

export async function addReservation(fd: FormData) {
  const { supabase, companyId } = await getCompanyId()
  const start = fd.get('start_date') as string
  const end = fd.get('end_date') as string
  const iid = fd.get('item_id') as string
  const { data: item } = await supabase.from('items').select('price_per_day').eq('id', iid).single()
  const total = item ? calcTotal(item.price_per_day, start, end) : 0
  await supabase.from('reservations').insert({
    company_id: companyId,
    client_id: fd.get('client_id') as string || null,
    item_id: iid || null,
    start_date: start, end_date: end,
    status: fd.get('status') as string || 'pending',
    notes: fd.get('notes') as string || null,
    total,
  })
  revalidatePath('/reservations')
}

export async function updateReservation(id: string, fd: FormData) {
  const { supabase } = await getCompanyId()
  const start = fd.get('start_date') as string
  const end = fd.get('end_date') as string
  const iid = fd.get('item_id') as string
  const { data: item } = await supabase.from('items').select('price_per_day').eq('id', iid).single()
  const total = item ? calcTotal(item.price_per_day, start, end) : 0
  await supabase.from('reservations').update({
    client_id: fd.get('client_id') as string || null,
    item_id: iid || null,
    start_date: start, end_date: end,
    status: fd.get('status') as string,
    notes: fd.get('notes') as string || null,
    total,
  }).eq('id', id)
  revalidatePath('/reservations')
}

export async function deleteReservation(id: string) {
  const { supabase } = await getCompanyId()
  await supabase.from('reservations').delete().eq('id', id)
  revalidatePath('/reservations')
}
