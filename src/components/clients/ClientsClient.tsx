'use client'
import { useState } from 'react'
import { addClient, updateClient, deleteClient } from '@/app/(protected)/clients/actions'
import { fmt } from '@/lib/utils'
import type { Client } from '@/lib/types'

type Props = { clients: Client[]; reservations: any[] }

export default function ClientsClient({ clients, reservations }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [loading, setLoading] = useState(false)

  function openAdd() { setEditing(null); setShowForm(true) }
  function openEdit(c: Client) { setEditing(c); setShowForm(true) }
  function closeForm() { setShowForm(false); setEditing(null) }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true)
    const fd = new FormData(e.currentTarget)
    if (editing) await updateClient(editing.id, fd)
    else await addClient(fd)
    setLoading(false); closeForm()
  }

  const getCount = (id: string) => reservations.filter(r => r.client_id === id).length
  const getTotal = (id: string) => reservations.filter(r => r.client_id === id).reduce((s, r) => s + (r.total || 0), 0)

  const fields = [
    { name:'name',  label:'Nome *',    placeholder:'Nome completo',        type:'text',  required:true  },
    { name:'email', label:'Email',     placeholder:'email@empresa.pt',     type:'email', required:false },
    { name:'phone', label:'Telefone',  placeholder:'+351 900 000 000',     type:'text',  required:false },
    { name:'notes', label:'Notas',     placeholder:'Notas internas...',    type:'text',  required:false },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500 mt-1">{clients.length} clientes registados</p>
        </div>
        <button onClick={openAdd} className="bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-dark transition">
          + Novo Cliente
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="font-semibold mb-4">{editing ? 'Editar Cliente' : 'Novo Cliente'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {fields.map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <input name={f.name} type={f.type} required={f.required} placeholder={f.placeholder}
                    defaultValue={(editing as any)?.[f.name] || ''}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
                </div>
              ))}
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
              <tr>{['Nome','Email','Telefone','Reservas','Total Gasto','Notas','Ações'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!clients.length ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  <div className="text-3xl mb-2">👥</div>
                  <p>Nenhum cliente ainda.</p>
                  <button onClick={openAdd} className="mt-2 text-teal text-sm font-medium hover:underline">Adicionar primeiro cliente</button>
                </td></tr>
              ) : clients.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold">{c.name}</td>
                  <td className="px-4 py-3 text-blue-600 text-xs">{c.email || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{c.phone || '—'}</td>
                  <td className="px-4 py-3 font-bold text-teal">{getCount(c.id)}</td>
                  <td className="px-4 py-3 font-semibold">{fmt(getTotal(c.id))}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs max-w-xs truncate" title={c.notes||''}>{c.notes || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="text-xs border border-gray-200 rounded px-2.5 py-1 hover:bg-gray-100">Editar</button>
                      <button onClick={() => { if(confirm('Apagar cliente?')) deleteClient(c.id) }} className="text-xs text-red-600 border border-red-100 rounded px-2.5 py-1 hover:bg-red-50">Apagar</button>
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
