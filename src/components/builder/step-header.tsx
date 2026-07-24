"use client";

import type { BundleStep } from "@/features/bundle/bundle.types";

function CustomChevron({ className }: { className?: string }) {
  return (
    <svg
      width="10"
      height="7"
      viewBox="0 0 10 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Toggle"
    >
      <path
        d="M4.12248 0.209382C4.32189 -0.0697919 4.7368 -0.0697896 4.93621 0.209386L8.96458 5.84915C9.20096 6.18009 8.96439 6.63977 8.55771 6.63977L0.500897 6.63977C0.09421 6.63977 -0.142352 6.18008 0.0940317 5.84915L4.12248 0.209382Z"
        fill="currentColor"
      />
    </svg>
  );
}

interface StepHeaderProps {
  step: BundleStep;
  isOpen: boolean;
  selectedCount: number;
  onToggle: () => void;
}

export function StepHeader({
  step,
  isOpen,
  selectedCount,
  onToggle,
}: StepHeaderProps) {
  const hasSelected = selectedCount > 0;

  return (
    <div className={`w-full ${isOpen ? "bg-panel rounded-t-lg" : ""}`}>
      <div
        className={`text-xs font-normal uppercase text-muted mb-1 px-3.5 ${isOpen ? "pt-3.5" : "pt-0"}`}
      >
        Step {step.stepNumber} of 4
      </div>

      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className={`flex w-full items-center justify-between py-4 border-t ${!isOpen ? "border-b" : ""}  border-line-soft text-left outline-none transition-all hover:opacity-80 px-3.5`}
      >
        <span className="flex flex-1 min-w-0 items-center gap-3">
          {/* biome-ignore lint/performance/noImgElement: icon is a runtime string path from JSON data */}
          <img
            src={step.icon}
            alt=""
            className="w-6 h-6 shrink-0 object-contain"
          />
          <span className="text-lg sm:text-[22px] font-normal text-heading truncate">
            {step.title}
          </span>
        </span>

        <span className="flex items-center gap-2 shrink-0 ml-2">
          <div className="relative flex items-center h-5">
            {hasSelected && (
              <span
                key={selectedCount}
                className="animate-fade-scale text-xs sm:text-sm text-primary inline-block tabular-nums whitespace-nowrap"
              >
                {selectedCount} selected
              </span>
            )}
          </div>
          <CustomChevron
            className={`text-primary shrink-0 transition-transform duration-300 ${!isOpen ? "rotate-180" : ""}`}
          />
        </span>
      </button>
    </div>
  );
}
