import { createClient } from '@/lib/supabase/server'
import MetricCard from '@/components/MetricCard'
import StatusBadge from '@/components/StatusBadge'
import { fmt } from '@/lib/utils'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user!.id).single()
  if (!company) return <div className="p-8 text-gray-500">Empresa não encontrada.</div>

  const cid = company.id

  const [{ data: items }, { data: clients }, { data: reservations }] = await Promise.all([
    supabase.from('items').select('*').eq('company_id', cid),
    supabase.from('clients').select('*').eq('company_id', cid),
    supabase.from('reservations').select('*, client:clients(name), item:items(name, emoji)')
      .eq('company_id', cid).order('created_at', { ascending: false }),
  ])

  const active = (reservations || []).filter(r => r.status === 'active').length
  const pending = (reservations || []).filter(r => r.status === 'pending').length
  const gmv = (reservations || []).filter(r => r.status !== 'cancelled').reduce((s, r) => s + (r.total || 0), 0)
  const occ = items?.length ? Math.round(active / items.length * 100) : 0

  const topItems = (items || []).map(it => ({
    ...it,
    count: (reservations || []).filter(r => r.item_id === it.id).length,
    rev: (reservations || []).filter(r => r.item_id === it.id).reduce((s, r) => s + (r.total || 0), 0),
  })).sort((a, b) => b.rev - a.rev).slice(0, 5)

  const recent = (reservations || []).slice(0, 8)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <span className="text-sm text-gray-400">Visão geral do negócio</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="GMV Total" value={fmt(gmv)} sub="Todas as reservas" accent />
        <MetricCard label="Reservas Ativas" value={String(active)} sub={`${pending} pendentes`} />
        <MetricCard label="Clientes" value={String(clients?.length || 0)} sub={`${items?.length || 0} itens no catálogo`} />
        <MetricCard label="Taxa de Ocupação" value={`${occ}%`} sub="Itens em uso agora" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Últimas Reservas</h2>
            <Link href="/reservations" className="text-teal text-sm font-medium hover:underline">Ver todas →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>{['Cliente','Item','Período','Total','Estado'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {!recent.length ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    Sem reservas ainda. <Link href="/reservations" className="text-teal">Criar primeira</Link>
                  </td></tr>
                ) : recent.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{(r.client as any)?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{(r.item as any) ? `${(r.item as any).emoji} ${(r.item as any).name}` : '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{r.start_date} → {r.end_date}</td>
                    <td className="px-4 py-3 font-semibold">{fmt(r.total)}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Top Equipamentos</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {!topItems.length ? <p className="p-4 text-sm text-gray-400">Sem dados</p> :
              topItems.map(it => (
                <div key={it.id} className="px-5 py-3 flex items-center justify-between">
                  <span className="text-sm">{it.emoji} {it.name}</span>
                  <div className="text-right">
                    <span className="text-teal font-semibold text-sm">{it.count}×</span>
                    <span className="text-gray-400 text-xs ml-2">{fmt(it.rev)}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
