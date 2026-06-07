"use client";

import { STEPS } from "@/app/(main)/request-blood/constants/steps";

interface StepProgressProps {
  currentStep: number;
  progress: number;
}

export function StepProgress({ currentStep, progress }: StepProgressProps) {
  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="h-1 bg-slate-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-linear-to-r from-rose-400 to-rose-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex items-center justify-between">
        {STEPS.map(({ id, label, icon: Icon }) => (
          <div key={id} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                currentStep >= id
                  ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                currentStep === id
                  ? "text-rose-600"
                  : currentStep > id
                    ? "text-slate-500"
                    : "text-slate-300"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
