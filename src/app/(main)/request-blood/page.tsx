"use client";

import { useState } from "react";
import {
  useForm,
  useWatch,
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  FieldError,
  type Control,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  ShieldCheck,
  Activity,
  Send,
  User,
  Hospital,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Calendar,
  Stethoscope,
  BedDouble,
  FileText,
  HeartPulse,
  UserCircle,
  Building2,
  Syringe,
  BadgeCheck,
  Info,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { createBloodRequest } from "@/store";
import toast, { Toaster } from "react-hot-toast";
import DonorMapSection from "./components/donorMapSection";

// ── Schema ──────────────────────────────────────────────────────────────────

const step1Schema = z.object({
  patientName: z.string().min(2, "Patient name is required"),
  patientAge: z.string().min(1, "Age is required"),
  patientGender: z.enum(["male", "female", "other"], {
    message: "Select gender",
  }),
  patientCondition: z.string().min(10, "Please describe the condition briefly"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], {
    message: "Select a blood group",
  }),
  unitsRequired: z.string().min(1, "Specify units required"),
  componentType: z.enum(["whole_blood", "platelets", "plasma", "red_cells"], {
    message: "Select component type",
  }),
});

const step2Schema = z.object({
  hospital: z.string().min(3, "Hospital name is required"),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  ward: z.string().optional(),
  doctorName: z.string().min(2, "Doctor name is required"),
  doctorContact: z.string().optional(),
});

const step3Schema = z.object({
  urgencyLevel: z.enum(["normal", "urgent", "emergency"], {
    message: "Select urgency level",
  }),
  requiredBy: z.string().min(1, "Required date/time is needed"),
  requiredByTime: z.string().optional(),
  specialInstructions: z.string().optional(),
});

const step4Schema = z.object({
  requesterName: z.string().min(2, "Your name is required"),
  relation: z.string().min(1, "Relation to patient is required"),
  contactPhone: z.string().min(11, "Valid phone number is required"),
  alternatePhone: z.string().optional(),
  contactEmail: z
    .string()
    .email("Valid email required")
    .optional()
    .or(z.literal("")),
  agreedToGuidelines: z
    .boolean()
    .refine((v) => v === true, "You must agree to guidelines"),
});

const fullSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema);
type FormValues = z.infer<typeof fullSchema>;
type UrgencyLevel = FormValues["urgencyLevel"];

// ── Constants ────────────────────────────────────────────────────────────────

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
] as const;

const DIVISIONS = [
  "Dhaka",
  "Chittagong",
  "Rajshahi",
  "Khulna",
  "Sylhet",
  "Barisal",
  "Rangpur",
  "Mymensingh",
];

const STEPS = [
  { id: 1, label: "Patient", icon: User },
  { id: 2, label: "Hospital", icon: Building2 },
  { id: 3, label: "Urgency", icon: Zap },
  { id: 4, label: "Contact", icon: Phone },
];

const COMPONENT_TYPES = [
  { value: "whole_blood", label: "Whole Blood", desc: "Most common" },
  { value: "platelets", label: "Platelets", desc: "Clotting" },
  { value: "plasma", label: "Plasma", desc: "Proteins" },
  { value: "red_cells", label: "Red Cells", desc: "Oxygen" },
] as const;

const URGENCY_OPTIONS = [
  {
    value: "normal",
    label: "Normal",
    desc: "Within 72 hours",
    bg: "bg-slate-50",
    activeBg: "bg-slate-100",
    ring: "ring-slate-300",
    dot: "bg-slate-400",
    text: "text-slate-600",
  },
  {
    value: "urgent",
    label: "Urgent",
    desc: "Within 24 hours",
    bg: "bg-amber-50",
    activeBg: "bg-amber-100",
    ring: "ring-amber-400",
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
  {
    value: "emergency",
    label: "Emergency",
    desc: "Immediate — life at risk",
    bg: "bg-red-50",
    activeBg: "bg-red-100",
    ring: "ring-red-500",
    dot: "bg-red-500",
    text: "text-red-700",
  },
] as const;

// ── Shared UI ────────────────────────────────────────────────────────────────

const inputCls = (err?: FieldError) =>
  `w-full px-4 py-3.5 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 focus:bg-white transition-all text-sm font-medium text-slate-800 placeholder:text-slate-300 ${err ? "border-red-400 bg-red-50/30" : "border-slate-200 hover:border-slate-300"}`;

function Field({
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

// ── Step Components ──────────────────────────────────────────────────────────

function StepPatient({
  register,
  errors,
  control,
  setValue,
}: {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}) {
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

function StepHospital({
  register,
  errors,
}: {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}) {
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

function StepUrgency({
  register,
  errors,
  control,
  setValue,
}: {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}) {
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

function StepContact({
  register,
  errors,
  control,
}: {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  control: Control<FormValues>;
}) {
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
            <option>Spouse</option>
            <option>Parent</option>
            <option>Child</option>
            <option>Sibling</option>
            <option>Relative</option>
            <option>Friend</option>
            <option>Hospital Staff</option>
            <option>Other</option>
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

// ── Main Page ────────────────────────────────────────────────────────────────

export default function RequestBloodPage() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.requests);

  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(fullSchema),
    defaultValues: { urgencyLevel: "urgent", agreedToGuidelines: false },
    mode: "onChange",
  });

  const stepFields: Record<number, (keyof FormValues)[]> = {
    1: [
      "patientName",
      "patientAge",
      "patientGender",
      "patientCondition",
      "bloodGroup",
      "unitsRequired",
      "componentType",
    ],
    2: ["hospital", "division", "district", "doctorName"],
    3: ["urgencyLevel", "requiredBy"],
    4: ["requesterName", "relation", "contactPhone", "agreedToGuidelines"],
  };

  const goNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, 4));
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const resultAction = await dispatch(createBloodRequest(data));

      if (createBloodRequest.fulfilled.match(resultAction)) {
        toast.success("Blood donation request submitted successfully!");
        setSubmittedData(data);
        setIsSubmitted(true);
      } else {
        toast.error(resultAction.payload || "Failed to submit request");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const progress = ((step - 1) / 3) * 100;

  const urgency = useWatch({
    control,
    name: "urgencyLevel",
    defaultValue: "urgent",
  });
  const urgencyColors: Record<UrgencyLevel, string> = {
    normal: "from-slate-400 to-slate-500",
    urgent: "from-amber-400 to-amber-600",
    emergency: "from-red-500 to-rose-700",
  };
  const urgencyKey: UrgencyLevel =
    urgency === "normal" || urgency === "urgent" || urgency === "emergency"
      ? urgency
      : "urgent";
  const urgencyGradient = urgencyColors[urgencyKey];

  return (
    <>
      <Toaster position="top-right" />
      <main className="min-h-screen bg-slate-50">
        {/* Urgency ambient top bar */}
        <div
          className={`h-1 w-full bg-linear-to-r ${urgencyGradient} transition-all duration-500`}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* ── Left Panel ── */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="sticky top-20 space-y-5">
              {/* Hero text */}
              <div>
                <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">
                  Urgent Assistance
                </span>
                <h1
                  className="text-4xl font-extrabold text-slate-900 leading-tight mt-2 mb-3"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Every second is a{" "}
                  <span className="text-rose-600 italic">heartbeat.</span>
                </h1>
                <p className="text-slate-500 text-[15px] leading-relaxed">
                  Submit your request to our verified donor network. We connect
                  you with local heroes ready to give the gift of life.
                </p>
              </div>

              {/* Info cards */}
              <div className="space-y-3">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Verified Network",
                    desc: "10,000+ pre-screened eligible donors across Bangladesh",
                    color: "text-blue-500 bg-blue-50",
                  },
                  {
                    icon: Activity,
                    title: "Instant Broadcast",
                    desc: "Alerts sent immediately to donors in your hospital vicinity",
                    color: "text-rose-500 bg-rose-50",
                  },
                  {
                    icon: HeartPulse,
                    title: "24/7 Support",
                    desc: "Our team monitors critical requests around the clock",
                    color: "text-green-500 bg-green-50",
                  },
                ].map(({ icon: Icon, title, desc, color }) => (
                  <div
                    key={title}
                    className="bg-white border border-slate-100 rounded-2xl p-4 flex items-start gap-3 shadow-sm"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "8K+", label: "Lives Saved" },
                  { value: "12K+", label: "Donors" },
                  { value: "64", label: "Districts" },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="bg-white border border-slate-100 rounded-2xl p-3 text-center shadow-sm"
                  >
                    <p className="text-lg font-black text-rose-600">{value}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Emergency hotline */}
              <div className="bg-rose-600 rounded-2xl p-4 flex items-center gap-3 text-white">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-rose-200">
                    Emergency Hotline
                  </p>
                  <p className="text-base font-extrabold">16 600</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Form Panel ── */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              {isSubmitted && submittedData ? (
                /* ── Success Screen ── */
                <div className="p-8 sm:p-12">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-50 border-4 border-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                    <h2
                      className="text-2xl font-black text-slate-900 mb-2"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Request Broadcasted!
                    </h2>
                    <p className="text-slate-500 text-[15px] max-w-md mx-auto leading-relaxed">
                      Your request for{" "}
                      <strong>
                        {submittedData.unitsRequired} unit(s) of{" "}
                        {submittedData.bloodGroup}
                      </strong>{" "}
                      blood has been sent to donors near{" "}
                      <strong>{submittedData.hospital}</strong>.
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { label: "Patient", value: submittedData.patientName },
                      { label: "Blood Group", value: submittedData.bloodGroup },
                      { label: "Units", value: submittedData.unitsRequired },
                      { label: "Hospital", value: submittedData.hospital },
                      {
                        label: "Urgency",
                        value: submittedData.urgencyLevel.toUpperCase(),
                      },
                      { label: "Contact", value: submittedData.contactPhone },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          {label}
                        </p>
                        <p className="text-sm font-bold text-slate-800 mt-0.5 truncate">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Next steps */}
                  <div className="space-y-2 mb-8">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      What happens next
                    </p>
                    {[
                      {
                        step: "Request live — donors in your area are being notified now",
                        done: true,
                      },
                      {
                        step: "Matching donors will call your contact number directly",
                        done: false,
                      },
                      {
                        step: "You confirm a donor and coordinate at the hospital",
                        done: false,
                      },
                    ].map(({ step: s, done }, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${done ? "bg-green-500" : "bg-slate-100"}`}
                        >
                          {done ? (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold">
                              {i + 1}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm leading-snug ${done ? "text-green-700 font-semibold" : "text-slate-500"}`}
                        >
                          {s}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setStep(1);
                    }}
                    className="w-full py-3.5 border-2 border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold rounded-xl transition-all text-sm"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <>
                  {/* ── Step Progress Header ── */}
                  <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2
                          className="text-lg font-black text-slate-900"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          Blood Request Form
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Step {step} of 4 — fill all required fields
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          urgency === "emergency"
                            ? "bg-red-100 text-red-600"
                            : urgency === "urgent"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {urgency || "Normal"}
                      </div>
                    </div>

                    {/* Step indicators */}
                    <div className="flex items-center gap-2">
                      {STEPS.map(({ id, label, icon: Icon }, idx) => (
                        <div
                          key={id}
                          className="flex items-center gap-2 flex-1"
                        >
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all text-xs font-bold ${
                                step > id
                                  ? "bg-rose-600 text-white"
                                  : step === id
                                    ? "bg-rose-600 text-white ring-4 ring-rose-100"
                                    : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {step > id ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <Icon className="w-3.5 h-3.5" />
                              )}
                            </div>
                            <span
                              className={`text-[10px] font-semibold mt-1 hidden sm:block ${step >= id ? "text-rose-600" : "text-slate-400"}`}
                            >
                              {label}
                            </span>
                          </div>
                          {idx < STEPS.length - 1 && (
                            <div
                              className={`flex-1 h-0.5 mb-4 sm:mb-0 rounded-full transition-all ${step > id ? "bg-rose-500" : "bg-slate-100"}`}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-linear-to-r ${urgencyGradient} rounded-full transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* ── Form Body ── */}
                  <div className="px-6 sm:px-8 py-7">
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                      {/* Step label */}
                      <div className="flex items-center gap-2.5 mb-6">
                        {(() => {
                          const { icon: Icon, label } = STEPS[step - 1];
                          return (
                            <>
                              <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center">
                                <Icon className="w-4 h-4 text-rose-600" />
                              </div>
                              <div>
                                <p className="text-xs text-slate-400 font-medium">
                                  Step {step} of 4
                                </p>
                                <p className="text-sm font-bold text-slate-800">
                                  {label} Information
                                </p>
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      {step === 1 && (
                        <StepPatient
                          register={register}
                          errors={errors}
                          control={control}
                          setValue={setValue}
                        />
                      )}
                      {step === 2 && (
                        <StepHospital register={register} errors={errors} />
                      )}
                      {step === 3 && (
                        <StepUrgency
                          register={register}
                          errors={errors}
                          control={control}
                          setValue={setValue}
                        />
                      )}
                      {step === 4 && (
                        <StepContact
                          register={register}
                          errors={errors}
                          control={control}
                        />
                      )}

                      {/* Navigation */}
                      <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
                        {step > 1 && (
                          <button
                            type="button"
                            onClick={() => setStep((s) => s - 1)}
                            className="flex items-center gap-1.5 px-5 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
                          >
                            <ChevronLeft className="w-4 h-4" /> Back
                          </button>
                        )}

                        {step < 4 ? (
                          <button
                            type="button"
                            onClick={goNext}
                            className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors text-sm shadow-md shadow-rose-100"
                          >
                            Continue <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="submit"
                            disabled={loading || isSubmitting}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 text-white font-bold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-lg bg-linear-to-r ${urgencyGradient}`}
                          >
                            {loading || isSubmitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                                Broadcasting…
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" /> Submit Blood
                                Request
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <DonorMapSection />
    </>
  );
}
