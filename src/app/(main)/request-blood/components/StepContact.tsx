"use client";

import {
  useWatch,
  UseFormRegister,
  FieldErrors,
  Control,
} from "react-hook-form";
import { User, Phone, Mail, ShieldCheck, AlertCircle } from "lucide-react";
import { FormValues } from "@/app/(main)/request-blood/types/form";
import { Field } from "@/app/(main)/request-blood/ui/Field";
import { inputCls } from "@/app/(main)/request-blood/ui/input-styles";
import { RELATIONS } from "@/app/(main)/request-blood/constants/steps";

interface StepContactProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  control: Control<FormValues>;
}

export function StepContact({ register, errors, control }: StepContactProps) {
  const agreedToGuidelines = useWatch({
    control,
    name: "agreedToGuidelines",
  });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Your Full Name" error={errors.requesterName?.message}>
          <div className="relative">
            <input
              {...register("requesterName")}
              className={`${inputCls(errors.requesterName)} pl-10`}
              placeholder="e.g. Rahima Begum"
            />
            <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </Field>
        <Field label="Relation to Patient" error={errors.relation?.message}>
          <select
            {...register("relation")}
            className={inputCls(errors.relation)}
          >
            <option value="">Select relation</option>
            {RELATIONS.map((rel) => (
              <option key={rel}>{rel}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Primary Contact Phone"
          error={errors.contactPhone?.message}
        >
          <div className="relative">
            <input
              {...register("contactPhone")}
              type="tel"
              className={`${inputCls(errors.contactPhone)} pl-10`}
              placeholder="+880 1xxxxxxxxx"
            />
            <Phone className="absolute left-3 top-3.5 w-4 h-4 text-rose-400 pointer-events-none" />
          </div>
        </Field>
        <Field label="Alternate Phone (Optional)">
          <div className="relative">
            <input
              {...register("alternatePhone")}
              type="tel"
              className={`${inputCls()} pl-10`}
              placeholder="+880 1xxxxxxxxx"
            />
            <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </Field>
      </div>

      <Field label="Email Address (Optional)">
        <div className="relative">
          <input
            {...register("contactEmail")}
            type="email"
            className={`${inputCls(errors.contactEmail)} pl-10`}
            placeholder="you@example.com"
          />
          <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        {errors.contactEmail && (
          <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3 h-3" />
            {errors.contactEmail.message}
          </p>
        )}
      </Field>

      {/* Privacy note */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed">
          Your contact details are shared only with donors who respond to this
          request. We never sell or expose your data to third parties.
        </p>
      </div>

      {/* Consent */}
      <div>
        <label
          className={`flex items-start gap-3 cursor-pointer p-4 rounded-2xl border-2 transition-all ${agreedToGuidelines ? "border-rose-200 bg-rose-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}
        >
          <div className="relative flex items-center justify-center mt-0.5 shrink-0">
            <input
              type="checkbox"
              {...register("agreedToGuidelines")}
              className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-slate-300 bg-white checked:border-rose-600 checked:bg-rose-600 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/20 ring-offset-2"
            />
            <svg
              className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-sm text-slate-600 leading-snug">
            I confirm this is a genuine medical request. I agree to the{" "}
            <a
              href="/terms"
              className="text-rose-600 font-bold hover:underline"
            >
              Donor Privacy Guidelines
            </a>{" "}
            and urgent notification protocols.
          </span>
        </label>
        {errors.agreedToGuidelines && (
          <p className="text-red-500 text-xs mt-2 ml-1 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.agreedToGuidelines.message}
          </p>
        )}
      </div>
    </div>
  );
}
