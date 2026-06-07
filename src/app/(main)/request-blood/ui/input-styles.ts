import { AlertCircle, Info } from "lucide-react";
import { FieldError } from "react-hook-form";

export const inputCls = (err?: FieldError) =>
  `w-full px-4 py-3.5 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 focus:bg-white transition-all text-sm font-medium text-slate-800 placeholder:text-slate-300 ${err ? "border-red-400 bg-red-50/30" : "border-slate-200 hover:border-slate-300"}`;
