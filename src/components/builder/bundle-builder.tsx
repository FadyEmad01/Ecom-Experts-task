"use client";

import type { BundleState } from "@/features/bundle/bundle.types";
import { useBundle } from "@/hooks/use-bundle";
import { StepAccordion } from "./step-accordion";

export function BundleBuilder() {
  const {
    data,
    activeStepId,
    activeVariants,
    lines,
    setActiveStep,
    setActiveVariant,
    setLineQuantity,
    getProductsForStep,
  } = useBundle();

  const state: BundleState = { activeStepId, activeVariants, lines };

  // function getNextStepId(currentStepId: string): string | null {
  //   const currentIndex = data.steps.findIndex(
  //     (step) => step.id === currentStepId,
  //   );
  //   const nextStep = data.steps[currentIndex + 1];
  //   return nextStep?.id ?? null;
  // }

  return (
    <div className="space-y-3">
      <div className="text-center lg:hidden pb-2">
        <h1 className="text-3xl font-bold text-heading">{data.bundle.title}</h1>
      </div>

      {data.steps.map((step) => {
        const isOpen = activeStepId === step.id;
        const products = getProductsForStep(step.id);
        const currentStepIndex = data.steps.findIndex(
          (currentStep) => currentStep.id === step.id,
        );
        const nextStep = data.steps[currentStepIndex + 1];

        return (
          <StepAccordion
            key={step.id}
            step={step}
            products={products}
            state={state}
            isOpen={isOpen}
            currency={data.bundle.currency}
            locale={data.bundle.locale}
            onToggle={() => setActiveStep(isOpen ? null : step.id)}
            onNext={nextStep ? () => setActiveStep(nextStep.id) : undefined}
            nextStepTitle={nextStep?.title}
            onVariantChange={setActiveVariant}
            onQuantityChange={setLineQuantity}
          />
        );
      })}
    </div>
  );
}
