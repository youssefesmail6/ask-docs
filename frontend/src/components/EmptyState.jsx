import { FileSearch } from "lucide-react";

function EmptyState({
  title,
  message,
  action,
  icon: Icon = FileSearch,
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-ink-500">
        {message}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
