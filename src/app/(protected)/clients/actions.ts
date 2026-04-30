'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function getCompanyId() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = await supabase.from('companies').select('id').eq('owner_id', user!.id).single()
  return { supabase, companyId: data?.id }
}

export async function addClient(fd: FormData) {
  const { supabase, companyId } = await getCompanyId()
  await supabase.from('clients').insert({
    company_id: companyId,
    name: fd.get('name') as string,
    email: fd.get('email') as string || null,
    phone: fd.get('phone') as string || null,
    notes: fd.get('notes') as string || null,
  })
  revalidatePath('/clients')
}

export async function updateClient(id: string, fd: FormData) {
  const { supabase } = await getCompanyId()
  await supabase.from('clients').update({
    name: fd.get('name') as string,
    email: fd.get('email') as string || null,
    phone: fd.get('phone') as string || null,
    notes: fd.get('notes') as string || null,
  }).eq('id', id)
  revalidatePath('/clients')
}

export async function deleteClient(id: string) {
  const { supabase } = await getCompanyId()
  await supabase.from('clients').delete().eq('id', id)
  revalidatePath('/clients')
}
