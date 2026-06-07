import { useCallback } from "react";
import { STEP_FIELDS } from "@/app/(main)/request-blood/constants/steps";
import { FieldPath, FieldValues, UseFormTrigger } from "react-hook-form";

export function useStepNavigation<TFieldValues extends FieldValues>(
  currentStep: number,
  setStep: (step: number) => void,
  trigger: UseFormTrigger<TFieldValues>,
) {
  const goNext = useCallback(async () => {
    const valid = await trigger(
      STEP_FIELDS[currentStep] as FieldPath<TFieldValues>[],
    );
    if (valid) {
      setStep(Math.min(currentStep + 1, 4));
    }
  }, [currentStep, trigger, setStep]);

  const goBack = useCallback(() => {
    setStep(Math.max(currentStep - 1, 1));
  }, [currentStep, setStep]);

  const progress = ((currentStep - 1) / 3) * 100;

  return {
    goNext,
    goBack,
    progress,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === 4,
  };
}
