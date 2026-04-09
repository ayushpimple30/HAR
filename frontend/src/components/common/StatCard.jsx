export default function StatCard({ label, value, subtext }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {subtext ? <p className="mt-1 text-xs text-slate-400">{subtext}</p> : null}
    </div>
  );
}
