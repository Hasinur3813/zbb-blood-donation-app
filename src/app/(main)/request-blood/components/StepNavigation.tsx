"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepNavigationProps {
  step: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function StepNavigation({
  step,
  onPrev,
  onNext,
  onSubmit,
  isLoading,
}: StepNavigationProps) {
  const isLastStep = step === 4;

  return (
    <div className="flex gap-3 pt-6">
      {step > 1 && (
        <button
          onClick={onPrev}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      )}

      {!isLastStep && (
        <button
          onClick={onNext}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors disabled:opacity-50"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {isLastStep && (
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors disabled:opacity-50"
        >
          {isLoading ? "Submitting..." : "Submit Request"}
        </button>
      )}
    </div>
  );
}
