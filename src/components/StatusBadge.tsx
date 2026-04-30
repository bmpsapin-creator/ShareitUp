const styles: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-800',
  active:    'bg-emerald-50 text-emerald-800',
  done:      'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-50 text-red-700',
}
const labels: Record<string, string> = {
  pending: 'Pendente', active: 'Ativa', done: 'Concluída', cancelled: 'Cancelada'
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {labels[status] || status}
    </span>
  )
}
