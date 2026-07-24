"use client";

import { useCallback } from "react";
import { BundleBuilder } from "@/components/builder/bundle-builder";
import { ReviewPanel } from "@/components/review/review-panel";
import type { ProductId, VariantId } from "@/features/bundle/bundle.types";
import { useBundle } from "@/hooks/use-bundle";

export function BundleExperience() {
  const { data, resolvedLines, totals, setLineQuantity, resetBundle } =
    useBundle();

  const handleQuantityChange = useCallback(
    (productId: ProductId, variantId: VariantId | null, quantity: number) => {
      if (variantId === null) return;
      setLineQuantity(productId, variantId, quantity);
    },
    [setLineQuantity],
  );

  return (
    <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[768px_399px] [&>*]:min-w-0">
      <BundleBuilder />

      <ReviewPanel
        data={data}
        resolvedLines={resolvedLines}
        totals={totals}
        onQuantityChange={handleQuantityChange}
        onSave={resetBundle}
      />
    </div>
  );
}
