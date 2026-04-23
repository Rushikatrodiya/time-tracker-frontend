export default function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
        {label}
      </p>
      <p className="text-[22px] font-semibold text-slate-900">{value}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}
