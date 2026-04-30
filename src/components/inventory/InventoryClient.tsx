'use client'
import { useState } from 'react'
import { addItem, updateItem, deleteItem, toggleItem } from '@/app/(protected)/inventory/actions'
import StatusBadge from '@/components/StatusBadge'
import type { Item } from '@/lib/types'
import { fmt } from '@/lib/utils'

const CATS = ['Audiovisual','Iluminação','Áudio','Eventos','Ferramentas','Construção','Transporte','Outros']

type Props = { items: Item[]; reservations: any[] }

export default function InventoryClient({ items, reservations }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Item | null>(null)
  const [loading, setLoading] = useState(false)

  function openAdd() { setEditing(null); setShowForm(true) }
  function openEdit(item: Item) { setEditing(item); setShowForm(true) }
  function closeForm() { setShowForm(false); setEditing(null) }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    if (editing) await updateItem(editing.id, fd)
    else await addItem(fd)
    setLoading(false); closeForm()
  }

  const getRevenue = (itemId: string) =>
    reservations.filter(r => r.item_id === itemId).reduce((s, r) => s + (r.total || 0), 0)
  const getCount = (itemId: string) =>
    reservations.filter(r => r.item_id === itemId).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventário</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} equipamentos no catálogo</p>
        </div>
        <button onClick={openAdd}
          className="bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-dark transition">
          + Adicionar Item
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">{editing ? 'Editar Item' : 'Novo Item'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { name:'name', label:'Nome *', placeholder:'Ex: Projetor 4K Sony', defaultValue: editing?.name },
                { name:'price_per_day', label:'Preço/Dia (€) *', placeholder:'45', type:'number', defaultValue: editing?.price_per_day },
                { name:'emoji', label:'Emoji', placeholder:'📷', defaultValue: editing?.emoji || '📦' },
                { name:'description', label:'Descrição', placeholder:'Breve descrição...', defaultValue: editing?.description || '' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <input name={f.name} type={f.type || 'text'} required={f.name !== 'description' && f.name !== 'emoji'}
                    placeholder={f.placeholder} defaultValue={f.defaultValue as string}
                    step={f.name === 'price_per_day' ? '0.5' : undefined}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Categoria</label>
              <select name="category" defaultValue={editing?.category || 'Audiovisual'}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal">
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading}
                className="bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60">
                {loading ? 'A guardar...' : '💾 Guardar'}
              </button>
              <button type="button" onClick={closeForm}
                className="border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['Item','Categoria','Preço/Dia','Disponível','Alugueres','Receita','Ações'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!items.length ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  <div className="text-3xl mb-2">📦</div>
                  <p>Nenhum item no catálogo.</p>
                  <button onClick={openAdd} className="mt-2 text-teal text-sm font-medium hover:underline">
                    Adicionar primeiro item
                  </button>
                </td></tr>
              ) : items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="text-xl mr-2">{item.emoji}</span>
                    <span className="font-medium">{item.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">{item.category}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{fmt(item.price_per_day)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleItem(item.id, !item.available)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer border-0 ${
                        item.available ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                      {item.available ? 'Sim' : 'Não'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-teal font-semibold">{getCount(item.id)}</td>
                  <td className="px-4 py-3">{fmt(getRevenue(item.id))}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(item)}
                        className="text-xs border border-gray-200 rounded px-2.5 py-1 hover:bg-gray-100">Editar</button>
                      <button onClick={() => { if(confirm('Apagar?')) deleteItem(item.id) }}
                        className="text-xs text-red-600 border border-red-100 rounded px-2.5 py-1 hover:bg-red-50">Apagar</button>
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
