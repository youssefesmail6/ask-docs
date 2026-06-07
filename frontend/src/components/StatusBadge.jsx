import { AlertCircle, CheckCircle2, Clock3, Loader2 } from "lucide-react";

const statusConfig = {
  pending: {
    label: "Pending",
    classes: "border-amber-200 bg-amber-50 text-amber-700",
    Icon: Clock3,
  },
  processing: {
    label: "Processing",
    classes: "border-blue-200 bg-blue-50 text-blue-700",
    Icon: Loader2,
  },
  ready: {
    label: "Ready",
    classes: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    classes: "border-rose-200 bg-rose-50 text-rose-700",
    Icon: AlertCircle,
  },
};

function StatusBadge({ status = "pending" }) {
  const normalizedStatus = String(status).toLowerCase();
  const config = statusConfig[normalizedStatus] || statusConfig.pending;
  const Icon = config.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.classes}`}
    >
      <Icon
        className={`h-3.5 w-3.5 ${normalizedStatus === "processing" ? "animate-spin" : ""}`}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}

export default StatusBadge;
