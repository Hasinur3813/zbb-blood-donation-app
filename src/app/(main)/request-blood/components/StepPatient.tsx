"use client";

import {
  useWatch,
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  Control,
} from "react-hook-form";
import { UserCircle, Syringe } from "lucide-react";
import { FormValues } from "@/app/(main)/request-blood/types/form";
import { Field } from "@/app/(main)/request-blood/ui/Field";
import { inputCls } from "@/app/(main)/request-blood/ui/input-styles";
import { BLOOD_GROUPS } from "@/app/(main)/request-blood/constants/blood-groups";
import { COMPONENT_TYPES } from "@/app/(main)/request-blood/constants/component-types";

interface StepPatientProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}

export function StepPatient({
  register,
  errors,
  control,
  setValue,
}: StepPatientProps) {
  const selectedGroup = useWatch({ control, name: "bloodGroup" });
  const selectedComponent = useWatch({ control, name: "componentType" });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Patient Full Name" error={errors.patientName?.message}>
          <div className="relative">
            <input
              {...register("patientName")}
              className={`${inputCls(errors.patientName)} pl-10`}
              placeholder="e.g. Abdul Karim"
            />
            <UserCircle className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Age" error={errors.patientAge?.message}>
            <input
              {...register("patientAge")}
              type="number"
              min={0}
              className={inputCls(errors.patientAge)}
              placeholder="e.g. 45"
            />
          </Field>
          <Field label="Gender" error={errors.patientGender?.message}>
            <select
              {...register("patientGender")}
              className={inputCls(errors.patientGender)}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>
      </div>

      <Field
        label="Medical Condition / Reason"
        error={errors.patientCondition?.message}
        hint="Brief description helps donors understand urgency."
      >
        <textarea
          {...register("patientCondition")}
          rows={2}
          className={`${inputCls(errors.patientCondition)} resize-none`}
          placeholder="e.g. Post-operative cardiac surgery requiring transfusion..."
        />
      </Field>

      {/* Blood Group Picker */}
      <Field label="Blood Group Required" error={errors.bloodGroup?.message}>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-1">
          {BLOOD_GROUPS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() =>
                setValue("bloodGroup", g, { shouldValidate: true })
              }
              className={`py-2.5 rounded-xl text-sm font-extrabold border-2 transition-all ${
                selectedGroup === g
                  ? "bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-200"
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-600"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </Field>

      {/* Component Type */}
      <Field label="Blood Component" error={errors.componentType?.message}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
          {COMPONENT_TYPES.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setValue("componentType", value, { shouldValidate: true })
              }
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                selectedComponent === value
                  ? "border-rose-500 bg-rose-50 text-rose-700"
                  : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
              }`}
            >
              <p className="text-xs font-bold leading-tight">{label}</p>
              <p className="text-[10px] mt-0.5 opacity-70">{desc}</p>
            </button>
          ))}
        </div>
      </Field>

      <Field
        label="Units Required"
        error={errors.unitsRequired?.message}
        hint="1 unit ≈ 450ml of whole blood. Most surgeries require 2–4 units."
      >
        <div className="relative">
          <input
            {...register("unitsRequired")}
            type="number"
            min={1}
            max={20}
            className={`${inputCls(errors.unitsRequired)} pl-10`}
            placeholder="e.g. 3"
          />
          <Syringe className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </Field>
    </div>
  );
}
