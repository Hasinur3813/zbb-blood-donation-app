"use client";

import {
  useWatch,
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  Control,
} from "react-hook-form";
import {
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  FileText,
} from "lucide-react";
import { FormValues } from "@/app/(main)/request-blood/types/form";
import { Field } from "@/app/(main)/request-blood/ui/Field";
import { inputCls } from "@/app/(main)/request-blood/ui/input-styles";
import { URGENCY_OPTIONS } from "@/app/(main)/request-blood/constants/urgency-options";

interface StepUrgencyProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}

export function StepUrgency({
  register,
  errors,
  control,
  setValue,
}: StepUrgencyProps) {
  const selected = useWatch({ control, name: "urgencyLevel" });

  return (
    <div className="space-y-5">
      {/* Urgency Selector */}
      <Field label="Urgency Level" error={errors.urgencyLevel?.message}>
        <div className="space-y-2.5 mt-1">
          {URGENCY_OPTIONS.map(
            ({ value, label, desc, bg, activeBg, ring, dot, text }) => {
              const isSelected = selected === value;
              return (
                <label key={value} className="cursor-pointer block">
                  <input
                    className="hidden"
                    type="radio"
                    value={value}
                    {...register("urgencyLevel")}
                  />
                  <div
                    onClick={() =>
                      setValue("urgencyLevel", value, { shouldValidate: true })
                    }
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? `${activeBg} ${ring} ring-2 border-transparent`
                        : `${bg} border-transparent hover:border-slate-200`
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full shrink-0 ${dot} ${isSelected ? "ring-4 ring-offset-2 ring-current opacity-40" : ""}`}
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${text}`}>{label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className={`w-5 h-5 ${text} shrink-0`} />
                    )}
                  </div>
                </label>
              );
            },
          )}
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Blood Needed By (Date)"
          error={errors.requiredBy?.message}
        >
          <div className="relative">
            <input
              {...register("requiredBy")}
              type="date"
              className={`${inputCls(errors.requiredBy)} pl-10`}
            />
            <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </Field>
        <Field label="Time (if specific)">
          <div className="relative">
            <input
              {...register("requiredByTime")}
              type="time"
              className={`${inputCls()} pl-10`}
            />
            <Clock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </Field>
      </div>

      <Field
        label="Special Instructions for Donors"
        hint="Any specific requirements, entry procedure, or notes for the donor."
      >
        <div className="relative">
          <textarea
            {...register("specialInstructions")}
            rows={3}
            className={`${inputCls()} resize-none pl-10 pt-3`}
            placeholder="e.g. Bring NID. Ask for blood bank at gate 2. Contact us before arriving..."
          />
          <FileText className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </Field>

      {selected === "emergency" && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 animate-pulse-once">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700">
              Critical Request Protocol
            </p>
            <p className="text-xs text-red-600 leading-relaxed mt-1">
              Your request will be broadcast immediately to all nearby donors.
              Our team will also attempt to contact verified donors personally.
              Please keep your phone reachable.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
