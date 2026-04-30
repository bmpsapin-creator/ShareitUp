import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aluga.pt SaaS — Gestão de Inventário',
  description: 'Sistema de gestão de aluguer para empresas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  )
}
