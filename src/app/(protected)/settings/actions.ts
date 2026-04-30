'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'

export async function updateSettings(fd: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const name = fd.get('name') as string
  const slug = slugify(fd.get('slug') as string || name)
  await supabase.from('companies').update({
    name,
    email: fd.get('email') as string || null,
    phone: fd.get('phone') as string || null,
    slug,
  }).eq('owner_id', user!.id)
  revalidatePath('/settings')
  revalidatePath('/dashboard')
}
