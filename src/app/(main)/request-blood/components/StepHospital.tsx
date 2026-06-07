"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import {
  Hospital,
  Stethoscope,
  Phone,
  BedDouble,
  BadgeCheck,
} from "lucide-react";
import { FormValues } from "@/app/(main)/request-blood/types/form";
import { Field } from "@/app/(main)/request-blood/ui/Field";
import { inputCls } from "@/app/(main)/request-blood/ui/input-styles";
import { DIVISIONS } from "@/app/(main)/request-blood/constants/divisions";

interface StepHospitalProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

export function StepHospital({ register, errors }: StepHospitalProps) {
  return (
    <div className="space-y-5">
      <Field label="Hospital / Clinic Name" error={errors.hospital?.message}>
        <div className="relative">
          <input
            {...register("hospital")}
            className={`${inputCls(errors.hospital)} pl-10`}
            placeholder="e.g. Dhaka Medical College Hospital"
          />
          <Hospital className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Division" error={errors.division?.message}>
          <select
            {...register("division")}
            className={inputCls(errors.division)}
          >
            <option value="">Select division</option>
            {DIVISIONS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
        <Field label="District" error={errors.district?.message}>
          <input
            {...register("district")}
            className={inputCls(errors.district)}
            placeholder="e.g. Dhaka"
          />
        </Field>
      </div>

      <Field
        label="Ward / Cabin / Bed No."
        hint="Helps donors find you quickly inside the hospital."
      >
        <div className="relative">
          <input
            {...register("ward")}
            className={`${inputCls()} pl-10`}
            placeholder="e.g. ICU Ward 7, Bed 12"
          />
          <BedDouble className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Attending Doctor" error={errors.doctorName?.message}>
          <div className="relative">
            <input
              {...register("doctorName")}
              className={`${inputCls(errors.doctorName)} pl-10`}
              placeholder="Dr. Full Name"
            />
            <Stethoscope className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </Field>
        <Field
          label="Doctor's Contact (Optional)"
          hint="For donor verification calls."
        >
          <div className="relative">
            <input
              {...register("doctorContact")}
              type="tel"
              className={`${inputCls()} pl-10`}
              placeholder="+880 1xxxxxxxxx"
            />
            <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </Field>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
        <BadgeCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800 mb-0.5">
            Hospital Verification
          </p>
          <p className="text-xs text-blue-600 leading-relaxed">
            Requests linked to verified hospitals are prioritized and shown to
            more donors. Ensure the name matches official records.
          </p>
        </div>
      </div>
    </div>
  );
}
