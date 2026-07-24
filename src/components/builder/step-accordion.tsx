"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type {
  BundleProduct,
  BundleState,
  BundleStep,
  ProductId,
  VariantId,
} from "@/features/bundle/bundle.types";
import { ProductGrid } from "./product-grid";
import { StepHeader } from "./step-header";

interface StepAccordionProps {
  step: BundleStep;
  products: BundleProduct[];
  state: BundleState;
  isOpen: boolean;
  currency: string;
  locale: string;
  onToggle: () => void;
  onNext?: () => void;
  onVariantChange: (productId: ProductId, variantId: VariantId) => void;
  onQuantityChange: (
    productId: ProductId,
    variantId: VariantId,
    quantity: number,
  ) => void;
}

export function StepAccordion({
  step,
  products,
  state,
  isOpen,
  currency,
  locale,
  onToggle,
  onNext,
  onVariantChange,
  onQuantityChange,
}: StepAccordionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);

  useEffect(() => {
    if (contentRef.current) setH(contentRef.current.scrollHeight);
  });

  const selectedCount = state.lines.reduce((t, line) => {
    return products.some((p) => p.id === line.productId)
      ? t + line.quantity
      : t;
  }, 0);

  return (
    <section>
      <StepHeader
        step={step}
        isOpen={isOpen}
        selectedCount={selectedCount}
        onToggle={onToggle}
      />
      <div
        ref={contentRef}
        style={{
          maxHeight: isOpen ? `${h}px` : "0px",
          opacity: isOpen ? 1 : 0,
        }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div className="rounded-b-lg bg-panel p-4">
          <ProductGrid
            products={products}
            state={state}
            currency={currency}
            locale={locale}
            onVariantChange={onVariantChange}
            onQuantityChange={onQuantityChange}
          />
          {onNext && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                className="rounded-md border-2 border-[#4E2FD2] text-[#4E2FD2] font-semibold bg-transparent px-4 py-1"
                onClick={onNext}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
