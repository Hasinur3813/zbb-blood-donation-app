import { AlertCircle, Info } from "lucide-react";

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
          <Info className="w-3 h-3 shrink-0" />
          {hint}
        </p>
      )}
      {error && (
        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
