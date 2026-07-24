import { useMemo } from "react";
import { useBundleStore } from "@/components/bundle-provider";
import bundleData from "@/data/bundle-data.json";
import {
  getBundleTotals,
  getProductsByStepId,
  getResolvedBundleLines,
} from "@/features/bundle/bundle.selectors";
import type { BundleData, StepId } from "@/features/bundle/bundle.types";

const data = bundleData as BundleData;

export function useBundle() {
  const activeStepId = useBundleStore((s) => s.activeStepId);
  const activeVariants = useBundleStore((s) => s.activeVariants);
  const lines = useBundleStore((s) => s.lines);

  const setActiveStep = useBundleStore((s) => s.setActiveStep);
  const setActiveVariant = useBundleStore((s) => s.setActiveVariant);
  const setLineQuantity = useBundleStore((s) => s.setLineQuantity);
  const removeLine = useBundleStore((s) => s.removeLine);
  const resetBundle = useBundleStore((s) => s.resetBundle);

  const activeStep = useMemo(
    () => data.steps.find((step) => step.id === activeStepId),
    [activeStepId],
  );

  const resolvedLines = useMemo(
    () => getResolvedBundleLines(data, lines),
    [lines],
  );

  const totals = useMemo(() => getBundleTotals(resolvedLines), [resolvedLines]);

  return {
    data,
    activeStep,
    activeStepId,
    activeVariants,
    lines,
    resolvedLines,
    totals,
    hasSelectedLines: lines.length > 0,
    setActiveStep,
    setActiveVariant,
    setLineQuantity,
    removeLine,
    resetBundle,
    getProductsForStep: (stepId: StepId) => getProductsByStepId(data, stepId),
  };
}
