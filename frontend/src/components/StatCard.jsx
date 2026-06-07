const toneClasses = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  teal: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
};

function StatCard({ label, value, helper, icon: Icon, tone = "blue" }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-ink-950">{value}</p>
        </div>

        {Icon ? (
          <span
            className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${toneClasses[tone] || toneClasses.blue}`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        ) : null}
      </div>

      {helper ? <p className="mt-4 text-sm text-ink-500">{helper}</p> : null}
    </article>
  );
}

export default StatCard;
