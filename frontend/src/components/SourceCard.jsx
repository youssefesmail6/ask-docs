import { Quote } from "lucide-react";

function SourceCard({ source, index }) {
  const title =
    source?.document_title ||
    source?.documentTitle ||
    source?.title ||
    "Internal source";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-signal-600">
          <Quote className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-signal-600">
            Source {index + 1}
          </p>
          <h3 className="mt-1 text-base font-semibold text-ink-950">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-ink-600">
            {source?.content || "No source chunk was returned."}
          </p>
        </div>
      </div>
    </article>
  );
}

export default SourceCard;
