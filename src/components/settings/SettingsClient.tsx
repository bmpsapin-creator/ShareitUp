'use client'
import { useState } from 'react'
import { updateSettings } from '@/app/(protected)/settings/actions'
import type { Company } from '@/lib/types'

export default function SettingsClient({ company, userEmail }: { company: Company | null; userEmail: string }) {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true)
    await updateSettings(new FormData(e.currentTarget))
    setLoading(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const fields = [
    { name:'name',  label:'Nome da Empresa *', placeholder:'Ex: AV Productions Lda',   defaultValue: company?.name     },
    { name:'email', label:'Email de Contacto',  placeholder:'info@empresa.pt',           defaultValue: company?.email||'' },
    { name:'phone', label:'Telefone',            placeholder:'+351 900 000 000',          defaultValue: company?.phone||'' },
    { name:'slug',  label:'URL do Catálogo',     placeholder:'nome-empresa',              defaultValue: company?.slug||'' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Definições</h1>

      <div className="max-w-xl space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Dados da Empresa</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(f => (
              <div key={f.name}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                {f.name === 'slug' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 whitespace-nowrap">aluga.pt/catalog/</span>
                    <input name={f.name} placeholder={f.placeholder} defaultValue={f.defaultValue}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
                  </div>
                ) : (
                  <input name={f.name} required={f.name==='name'} placeholder={f.placeholder} defaultValue={f.defaultValue}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
                )}
              </div>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="bg-teal text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-60 hover:bg-teal-dark transition">
                {loading ? 'A guardar...' : '💾 Guardar Definições'}
              </button>
              {saved && <span className="text-emerald-600 text-sm font-medium">✓ Guardado!</span>}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-2">Conta</h2>
          <p className="text-sm text-gray-500 mb-1">Email de acesso: <strong className="text-gray-800">{userEmail}</strong></p>
          <p className="text-xs text-gray-400">Para alterar a password, usa a opção de recuperação de password no login.</p>
        </div>

        <div className="bg-white rounded-xl border border-teal/30 p-6">
          <h2 className="font-semibold text-teal mb-2">Próximos Passos</h2>
          <ul className="text-sm text-gray-600 space-y-1.5">
            {[
              'Integração Stripe para pagamentos online',
              'Notificações automáticas por email ao cliente',
              'Faturas PDF geradas automaticamente',
              'App móvel iOS + Android',
              'Scanner da Verdade (IA check-in/check-out)',
            ].map(item => (
              <li key={item} className="flex gap-2">
                <span className="text-teal flex-shrink-0">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
