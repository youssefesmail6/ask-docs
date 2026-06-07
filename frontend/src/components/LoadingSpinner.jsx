import { Loader2 } from "lucide-react";

function LoadingSpinner({ label = "Loading", className = "text-ink-600" }) {
  return (
    <span className={`inline-flex items-center gap-2 text-sm font-medium ${className}`}>
      <Loader2 className="h-4 w-4 animate-spin text-current" aria-hidden="true" />
      {label}
    </span>
  );
}

export default LoadingSpinner;
