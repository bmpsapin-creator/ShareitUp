import { createClient } from '@/lib/supabase/server'
import { fmt } from '@/lib/utils'

export default async function CatalogPreviewPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: company } = await supabase.from('companies').select('*').eq('owner_id', user!.id).single()
  const { data: items } = await supabase.from('items').select('*').eq('company_id', company!.id).eq('available', true)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catálogo Público</h1>
          <p className="text-sm text-gray-500 mt-1">Preview de como os teus clientes vêem os teus equipamentos</p>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-semibold text-emerald-800 mb-1">🔗 Link público do teu catálogo</p>
        <p className="text-emerald-700 font-mono text-sm">
          {process.env.NEXT_PUBLIC_SITE_URL || 'https://o-teu-site.vercel.app'}/catalog/{company?.slug}
        </p>
        <p className="text-xs text-emerald-600 mt-2">Partilha este link com os teus clientes — eles vêem o inventário e podem pedir reservas.</p>
      </div>

      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6">
        <div className="text-center border-b border-gray-100 pb-5 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{company?.name}</h2>
          <p className="text-gray-500 text-sm mt-1">{company?.email} · {company?.phone}</p>
          <span className="inline-block mt-3 bg-teal/10 text-teal text-xs font-semibold px-3 py-1 rounded-full">
            {items?.length || 0} equipamentos disponíveis para aluguer
          </span>
        </div>

        {!items?.length ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📦</div>
            <p>Nenhum item disponível no catálogo.</p>
            <p className="text-sm mt-1">Activa itens no Inventário para aparecerem aqui.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition">
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h3 className="font-semibold text-sm text-gray-900 mb-1">{item.name}</h3>
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">{item.description}</p>
                <p className="text-xl font-bold text-teal">
                  {fmt(item.price_per_day)}
                  <span className="text-xs text-gray-400 font-normal">/dia</span>
                </p>
                <button className="mt-3 w-full bg-teal text-white py-2 rounded-lg text-xs font-semibold hover:bg-teal-dark transition">
                  Pedir Reserva
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
