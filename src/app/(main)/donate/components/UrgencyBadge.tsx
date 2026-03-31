import { Urgency } from "../types";
import { urgencyConfig } from "../data";

export default function UrgencyBadge({
  urgency,
}: {
  urgency: Urgency | string;
}) {
  // Handle both API format (lowercase) and UI format (capitalized)
  const normalizedUrgency = urgency.toLowerCase() as keyof typeof urgencyConfig;
  const cfg = urgencyConfig[normalizedUrgency];
  const displayUrgency =
    urgency.charAt(0).toUpperCase() + urgency.slice(1).toLowerCase();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${cfg.badge}`}
    >
      {normalizedUrgency === "emergency" && (
        <span className="relative flex w-2 h-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${cfg.dot}`}
          />
          <span className="relative inline-flex rounded-full w-2 h-2 bg-rose-500" />
        </span>
      )}
      {displayUrgency}
    </span>
  );
}
