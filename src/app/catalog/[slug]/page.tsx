import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { fmt } from '@/lib/utils'

export default async function PublicCatalogPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: company } = await supabase.from('companies').select('*').eq('slug', params.slug).single()
  if (!company) notFound()

  const { data: items } = await supabase.from('items').select('*').eq('company_id', company.id).eq('available', true)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy text-white py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold">{company.name}</h1>
          <p className="text-gray-300 mt-2 text-sm">{company.email} · {company.phone}</p>
          <p className="text-teal mt-3 text-sm font-medium">{items?.length || 0} equipamentos disponíveis</p>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-10">
        {!items?.length ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-lg">Nenhum equipamento disponível de momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5 text-center shadow-sm hover:shadow-md transition">
                <div className="text-5xl mb-4">{item.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-gray-400 text-xs mb-4 leading-relaxed">{item.description}</p>
                <p className="text-2xl font-bold text-teal mb-4">
                  {fmt(item.price_per_day)}
                  <span className="text-sm text-gray-400 font-normal">/dia</span>
                </p>
                <a href={`mailto:${company.email}?subject=Reserva: ${item.name}`}
                  className="block w-full bg-teal text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-dark transition">
                  Pedir Reserva
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="text-center py-6 text-gray-400 text-xs border-t border-gray-200 mt-10">
        Powered by <span className="text-teal font-semibold">Aluga.pt</span>
      </footer>
    </div>
  )
}
