import { CalendarDays, FileText, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

function formatDate(value) {
  if (!value) return "No date";

  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "No date";
  }
}

function DocumentCard({ document, onDelete, isDeleting }) {
  const createdAt = document.created_at || document.createdAt;
  const chunksCount = document.chunks_count ?? document.chunksCount ?? 0;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-ink-950">
              {document.title || "Untitled document"}
            </h3>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-ink-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                {formatDate(createdAt)}
              </span>
              <span>{chunksCount} chunks</span>
            </div>
          </div>
        </div>

        <StatusBadge status={document.status} />
      </div>

      {document.content ? (
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink-600">
          {document.content}
        </p>
      ) : null}

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => onDelete(document.id)}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {isDeleting ? "Deleting" : "Delete"}
        </button>
      </div>
    </article>
  );
}

export default DocumentCard;
