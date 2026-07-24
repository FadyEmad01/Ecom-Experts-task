"use client";

import { Minus, Plus } from "lucide-react";
import { getStepperState } from "@/lib/stepper";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  inReview?: boolean;
  onChange: (nextValue: number) => void;
}

export function QuantityStepper({
  value,
  min = 0,
  max = 99,
  disabled = false,
  required = false,
  className,
  inReview = false,
  onChange,
}: QuantityStepperProps) {
  const { canDecrease, canIncrease } = getStepperState(
    value,
    min,
    max,
    disabled,
    required,
  );

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button
        type="button"
        disabled={!canDecrease}
        aria-label="Decrease quantity"
        onClick={() => canDecrease && onChange(value - 1)}
        className={cn(
          "flex size-[20px] shrink-0 items-center justify-center rounded-[4px] transition-colors",
          canDecrease
            ? inReview
              ? "bg-white text-[#575757] hover:text-heading"
              : "bg-[#F0F4F7] text-[#525963] hover:bg-[#E2E8F0]"
            : inReview
              ? "border-2 border-[#CED6DE] bg-[#F1F1F2] text-[#575757] cursor-not-allowed"
              : "bg-transparent border-2 border-[#E6EBF0] text-[#CED6DE] cursor-not-allowed",
        )}
      >
        <Minus className="size-3" strokeWidth={3} />
      </button>

      <div className="relative inline-flex items-center justify-center min-w-6">
        <span
          key={value}
          className="animate-fade-scale inline-block text-center text-[16px] font-semibold tabular-nums text-heading leading-none"
        >
          {value}
        </span>
      </div>

      <button
        type="button"
        disabled={!canIncrease}
        aria-label="Increase quantity"
        onClick={() => canIncrease && onChange(value + 1)}
        className={cn(
          "flex size-[20px] shrink-0 items-center justify-center rounded-[4px] transition-colors",
          canIncrease
            ? inReview
              ? "bg-white text-[#575757] hover:text-heading"
              : "bg-[#F0F4F7] text-[#525963] hover:bg-[#E2E8F0]"
            : inReview
              ? "border-2 border-[#CED6DE] bg-[#F1F1F2] text-[#575757] cursor-not-allowed"
              : "bg-transparent border-2 border-[#E6EBF0] text-[#CED6DE] cursor-not-allowed",
        )}
      >
        <Plus className="size-3" strokeWidth={3} />
      </button>
    </div>
  );
}
