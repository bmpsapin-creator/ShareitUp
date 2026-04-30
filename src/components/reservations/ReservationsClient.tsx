'use client'
import { useState } from 'react'
import { addReservation, updateReservation, deleteReservation } from '@/app/(protected)/reservations/actions'
import StatusBadge from '@/components/StatusBadge'
import { fmt, calcTotal } from '@/lib/utils'
import type { Reservation, Item, Client } from '@/lib/types'

type Props = { reservations: Reservation[]; items: Item[]; clients: Client[] }

const STATUSES = [['pending','Pendente'],['active','Ativa'],['done','Concluída'],['cancelled','Cancelada']]

export default function ReservationsClient({ reservations, items, clients }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [selItem, setSelItem] = useState<string>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  function openAdd() { setEditing(null); setTotal(0); setSelItem(''); setStartDate(''); setEndDate(''); setShowForm(true) }
  function openEdit(r: Reservation) {
    setEditing(r); setSelItem(r.item_id||''); setStartDate(r.start_date); setEndDate(r.end_date)
    setTotal(r.total||0); setShowForm(true)
  }
  function closeForm() { setShowForm(false); setEditing(null) }

  function updateTotal(iid: string, s: string, e: string) {
    const item = items.find(i => i.id === iid)
    if (item && s && e) setTotal(calcTotal(item.price_per_day, s, e))
    else setTotal(0)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true)
    const fd = new FormData(e.currentTarget)
    if (editing) await updateReservation(editing.id, fd)
    else await addReservation(fd)
    setLoading(false); closeForm()
  }

  const active = reservations.filter(r=>r.status==='active').length
  const pending = reservations.filter(r=>r.status==='pending').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
          <div className="flex gap-3 mt-1">
            <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full">{active} ativas</span>
            <span className="text-xs bg-amber-50 text-amber-800 font-medium px-2 py-0.5 rounded-full">{pending} pendentes</span>
          </div>
        </div>
        <button onClick={openAdd} className="bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-dark transition">
          + Nova Reserva
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="font-semibold mb-4">{editing ? 'Editar Reserva' : 'Nova Reserva'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Cliente</label>
                <select name="client_id" defaultValue={editing?.client_id||''} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal">
                  <option value="">Selecionar...</option>
                  {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Equipamento *</label>
                <select name="item_id" required defaultValue={editing?.item_id||''} onChange={e=>{setSelItem(e.target.value);updateTotal(e.target.value,startDate,endDate)}}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal">
                  <option value="">Selecionar...</option>
                  {items.map(i=><option key={i.id} value={i.id}>{i.emoji} {i.name} — {fmt(i.price_per_day)}/dia</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Estado</label>
                <select name="status" defaultValue={editing?.status||'pending'} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal">
                  {STATUSES.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Data Início *</label>
                <input name="start_date" type="date" required defaultValue={editing?.start_date||''} onChange={e=>{setStartDate(e.target.value);updateTotal(selItem,e.target.value,endDate)}}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Data Fim *</label>
                <input name="end_date" type="date" required defaultValue={editing?.end_date||''} onChange={e=>{setEndDate(e.target.value);updateTotal(selItem,startDate,e.target.value)}}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal"/>
              </div>
              <div className="flex flex-col justify-end">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Total Calculado</label>
                <p className="text-2xl font-bold text-teal">{fmt(total)}</p>
              </div>
              <div className="col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Notas</label>
                <input name="notes" placeholder="Notas internas..." defaultValue={editing?.notes||''}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal"/>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60">
                {loading ? 'A guardar...' : '💾 Guardar'}
              </button>
              <button type="button" onClick={closeForm} className="border border-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['Cliente','Equipamento','Início','Fim','Total','Notas','Estado','Ações'].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!reservations.length ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                  <div className="text-3xl mb-2">📋</div>Sem reservas ainda.
                </td></tr>
              ) : reservations.map(r=>(
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{(r.client as any)?.name||'—'}</td>
                  <td className="px-4 py-3">{(r.item as any)?`${(r.item as any).emoji} ${(r.item as any).name}`:'—'}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{r.start_date}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{r.end_date}</td>
                  <td className="px-4 py-3 font-bold">{fmt(r.total)}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs max-w-xs truncate">{r.notes||'—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status}/></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={()=>openEdit(r)} className="text-xs border border-gray-200 rounded px-2.5 py-1 hover:bg-gray-100">Editar</button>
                      <button onClick={()=>{if(confirm('Apagar?'))deleteReservation(r.id)}} className="text-xs text-red-600 border border-red-100 rounded px-2.5 py-1 hover:bg-red-50">Apagar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
