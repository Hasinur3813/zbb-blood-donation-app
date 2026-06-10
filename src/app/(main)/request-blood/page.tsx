"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  ShieldCheck,
  Activity,
  Send,
  Phone,
  ChevronRight,
  ChevronLeft,
  HeartPulse,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/store";
import { createBloodRequest } from "@/store";
import { StepPatient } from "./components/StepPatient";
import { StepHospital } from "./components/StepHospital";
import { StepUrgency } from "./components/StepUrgency";
import { StepContact } from "./components/StepContact";
import { StepProgress } from "./components/StepProgress";
import DonorMapSection from "./components/donorMapSection";
import { fullSchema } from "./constants/schemas";
import { STEPS } from "./constants/steps";
import { useStepNavigation } from "./hooks/useStepNavigation";
import { FormValues, UrgencyLevel } from "./types/form";

const urgencyColors: Record<UrgencyLevel, string> = {
  normal: "from-slate-400 to-slate-500",
  urgent: "from-amber-400 to-amber-600",
  emergency: "from-red-500 to-rose-700",
};

export default function RequestBloodPage() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.requests);
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
    defaultValues: {
      urgencyLevel: "urgent",
      agreedToGuidelines: false,
      requesterName: "Hasinur",
    },
    mode: "onChange",
  });

  const { goNext, goBack, progress } = useStepNavigation(
    step,
    setStep,
    trigger,
  );

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
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  const urgency = useWatch({
    control,
    name: "urgencyLevel",
    defaultValue: "urgent",
  }) as UrgencyLevel;

  const urgencyGradient = urgencyColors[urgency] || urgencyColors.urgent;

  return (
    <>
      <Toaster position="top-right" />
      <main className="min-h-screen bg-slate-50">
        {/* Urgency ambient top bar */}
        <div
          className={`h-1 w-full bg-linear-to-r ${urgencyGradient} transition-all duration-500`}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* ── Left Panel: Hero & Info ── */}
          <LeftPanel />

          {/* ── Right Panel: Form ── */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              {isSubmitted && submittedData ? (
                <SuccessScreen
                  data={submittedData}
                  onReset={() => {
                    setIsSubmitted(false);
                    setStep(1);
                  }}
                />
              ) : (
                <FormScreen
                  step={step}
                  progress={progress}
                  urgency={urgency}
                  urgencyGradient={urgencyGradient}
                  register={register}
                  errors={errors}
                  control={control}
                  setValue={setValue}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  onNext={goNext}
                  onPrev={goBack}
                  isLoading={loading || isSubmitting}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <DonorMapSection />
    </>
  );
}

/**
 * Left Panel Component
 */
function LeftPanel() {
  return (
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
            Submit your request to our verified donor network. We connect you
            with local heroes ready to give the gift of life.
          </p>
        </div>

        {/* Info cards */}
        <InfoCards />

        {/* Stats */}
        <StatsGrid />

        {/* Emergency hotline */}
        <EmergencyHotline />
      </div>
    </div>
  );
}

/**
 * Info Cards Sub-Component
 */
function InfoCards() {
  const cards = [
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
  ];

  return (
    <div className="space-y-3">
      {cards.map(({ icon: Icon, title, desc, color }) => (
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
            <p className="text-sm font-bold text-slate-800">{title}</p>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              {desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Stats Grid Sub-Component
 */
function StatsGrid() {
  const stats = [
    { value: "8K+", label: "Lives Saved" },
    { value: "12K+", label: "Donors" },
    { value: "64", label: "Districts" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map(({ value, label }) => (
        <div
          key={label}
          className="bg-white border border-slate-100 rounded-2xl p-3 text-center shadow-sm"
        >
          <p className="text-lg font-black text-rose-600">{value}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Emergency Hotline Sub-Component
 */
function EmergencyHotline() {
  return (
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
  );
}

/**
 * Form Screen Component
 */
type FormScreenProps = {
  step: number;
  progress: number;
  urgency: UrgencyLevel;
  urgencyGradient: string;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  handleSubmit: UseFormHandleSubmit<FormValues>;
  onSubmit: (data: FormValues) => Promise<void>;
  onNext: () => Promise<void>;
  onPrev: () => void;
  isLoading: boolean;
};

function FormScreen({
  step,
  progress,
  urgency,
  urgencyGradient,
  register,
  errors,
  control,
  setValue,
  handleSubmit,
  onSubmit,
  onNext,
  onPrev,
  isLoading,
}: FormScreenProps) {
  return (
    <>
      {/* Header */}
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
            {(urgency || "Normal").charAt(0).toUpperCase() +
              (urgency || "Normal").slice(1)}
          </div>
        </div>

        {/* Progress */}
        <StepProgress currentStep={step} progress={progress} />
      </div>

      {/* Form Body */}
      <div className="px-6 sm:px-8 py-7">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Step label */}
          <StepHeader step={step} />

          {/* Render active step */}
          {step === 1 && (
            <StepPatient
              register={register}
              errors={errors}
              control={control}
              setValue={setValue}
            />
          )}
          {step === 2 && <StepHospital register={register} errors={errors} />}
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
                onClick={onPrev}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-5 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={onNext}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors text-sm shadow-md shadow-rose-100 disabled:opacity-50"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-white font-bold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-lg bg-linear-to-r ${urgencyGradient}`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Broadcasting…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Request
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

/**
 * Step Header Sub-Component
 */
function StepHeader({ step }: { step: number }) {
  const { icon: Icon, label } = STEPS[step - 1];
  return (
    <div className="flex items-center gap-2.5 mb-6">
      <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center">
        <Icon className="w-4 h-4 text-rose-600" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">Step {step} of 4</p>
        <p className="text-sm font-bold text-slate-800">{label} Information</p>
      </div>
    </div>
  );
}

/**
 * Success Screen Component
 */
function SuccessScreen({
  data,
  onReset,
}: {
  data: FormValues;
  onReset: () => void;
}) {
  return (
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
          Your request for <strong>{data.unitsRequired} unit(s)</strong> of{" "}
          <strong>{data.bloodGroup}</strong> blood has been sent to donors near{" "}
          <strong>{data.hospital}</strong>.
        </p>
      </div>

      {/* Summary */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Patient", value: data.patientName },
          { label: "Blood Group", value: data.bloodGroup },
          { label: "Units", value: data.unitsRequired },
          { label: "Hospital", value: data.hospital },
          {
            label: "Urgency",
            value: (data.urgencyLevel || "").toUpperCase(),
          },
          { label: "Contact", value: data.contactPhone },
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
        onClick={onReset}
        className="w-full py-3.5 border-2 border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold rounded-xl transition-all text-sm"
      >
        Submit Another Request
      </button>
    </div>
  );
}
