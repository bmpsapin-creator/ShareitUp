export default function MetricCard({
  label, value, sub, accent
}: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">{label}</p>
      <p className={`text-2xl font-bold ${accent ? 'text-teal' : 'text-gray-900'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}
