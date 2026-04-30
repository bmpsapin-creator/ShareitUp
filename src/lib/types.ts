export type Company = {
  id: string
  name: string
  email: string | null
  phone: string | null
  slug: string
  owner_id: string
  created_at: string
}

export type Item = {
  id: string
  company_id: string
  name: string
  category: string | null
  price_per_day: number
  description: string | null
  emoji: string
  available: boolean
  created_at: string
}

export type Client = {
  id: string
  company_id: string
  name: string
  email: string | null
  phone: string | null
  notes: string | null
  created_at: string
}

export type Reservation = {
  id: string
  company_id: string
  client_id: string | null
  item_id: string | null
  start_date: string
  end_date: string
  status: 'pending' | 'active' | 'done' | 'cancelled'
  notes: string | null
  total: number | null
  created_at: string
  client?: Client
  item?: Item
}
