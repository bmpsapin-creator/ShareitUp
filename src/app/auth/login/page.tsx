'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Aluga<span className="text-teal">.pt</span></h1>
          <p className="text-gray-400 mt-2 text-sm">SaaS — Gestão de Inventário</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-semibold mb-6">Entrar na conta</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                placeholder="email@empresa.pt" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" required value={password} onChange={e=>setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                placeholder="••••••••" />
            </div>
            {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-teal text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-dark transition disabled:opacity-60">
              {loading ? 'A entrar...' : 'Entrar'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Sem conta?{' '}
            <Link href="/auth/signup" className="text-teal font-medium hover:underline">Registar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
