export function fmt(n: number | null | undefined): string {
  return '€' + Number(n || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function calcTotal(pricePerDay: number, start: string, end: string): number {
  if (!start || !end) return 0
  const days = Math.max(1, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000))
  return pricePerDay * days
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: 'Pendente', active: 'Ativa', done: 'Concluída', cancelled: 'Cancelada'
  }
  return map[status] || status
}

export function slugify(text: string): string {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
