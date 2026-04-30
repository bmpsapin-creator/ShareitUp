'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function getCompanyId() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data } = await supabase.from('companies').select('id').eq('owner_id', user.id).single()
  return { supabase, companyId: data?.id }
}

export async function addItem(fd: FormData) {
  const { supabase, companyId } = await getCompanyId()
  await supabase.from('items').insert({
    company_id: companyId,
    name: fd.get('name') as string,
    category: fd.get('category') as string,
    price_per_day: parseFloat(fd.get('price_per_day') as string),
    description: fd.get('description') as string,
    emoji: (fd.get('emoji') as string) || '📦',
    available: true,
  })
  revalidatePath('/inventory')
}

export async function updateItem(id: string, fd: FormData) {
  const { supabase } = await getCompanyId()
  await supabase.from('items').update({
    name: fd.get('name') as string,
    category: fd.get('category') as string,
    price_per_day: parseFloat(fd.get('price_per_day') as string),
    description: fd.get('description') as string,
    emoji: (fd.get('emoji') as string) || '📦',
  }).eq('id', id)
  revalidatePath('/inventory')
}

export async function toggleItem(id: string, available: boolean) {
  const { supabase } = await getCompanyId()
  await supabase.from('items').update({ available }).eq('id', id)
  revalidatePath('/inventory')
}

export async function deleteItem(id: string) {
  const { supabase } = await getCompanyId()
  await supabase.from('items').delete().eq('id', id)
  revalidatePath('/inventory')
}
