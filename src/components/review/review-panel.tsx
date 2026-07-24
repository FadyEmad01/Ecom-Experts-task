"use client";

import { PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getResolvedLinesByGroup } from "@/features/bundle/bundle.selectors";
import type {
  BundleData,
  BundleTotals,
  ProductId,
  ResolvedBundleLine,
  VariantId,
} from "@/features/bundle/bundle.types";
import { ReviewGroup } from "./review-group";
import { ReviewTotals } from "./review-totals";

interface ReviewPanelProps {
  data: BundleData;
  resolvedLines: ResolvedBundleLine[];
  totals: BundleTotals;
  onQuantityChange: (
    productId: ProductId,
    variantId: VariantId | null,
    quantity: number,
  ) => void;
  onSave: () => void;
}

export function ReviewPanel({
  data,
  resolvedLines,
  totals,
  onQuantityChange,
  onSave,
}: ReviewPanelProps) {
  const hasItems = resolvedLines.length > 0;

  return (
    <aside className="sticky top-6 h-fit rounded-lg bg-panel border-0 shadow-none">
      <p className="text-[11px] p-2.5 font-medium text-muted uppercase mb-1 tracking-widest">
        REVIEW
      </p>
      <div className="px-4 pb-4">
        <div className="border-b border-[#CED6DE] pb-5">
          <h2 className="text-[22px] font-semibold tracking-wide mb-1">
            Your security system
          </h2>

          <p className="text-sm leading-tight tracking-wide text-muted pr-4 text-balance">
            Review your personalized protection system designed to keep what matters most safe.
          </p>
        </div>

        <div className="relative">
          {!hasItems ? (
            <div className="py-10 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-white text-primary border border-[#CED6DE] shadow-sm">
                <PackageSearch
                  className="size-8 text-muted-light"
                  strokeWidth={1.5}
                />
              </div>

              <h3 className="text-base font-bold text-heading">
                {data.reviewPanel.emptyState.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                {data.reviewPanel.emptyState.description}
              </p>
            </div>
          ) : (
            <div className="pt-3 flex flex-col gap-4">
              {data.reviewPanel.groups.map((group) => {
                const groupLines = getResolvedLinesByGroup(
                  data,
                  resolvedLines,
                  group.stepId,
                );
                if (groupLines.length === 0) return null;
                return (
                  <ReviewGroup
                    key={group.stepId}
                    group={group}
                    lines={groupLines}
                    currency={data.bundle.currency}
                    locale={data.bundle.locale}
                    onQuantityChange={onQuantityChange}
                  />
                );
              })}
            </div>
          )}
        </div>

        {hasItems && (
          <div className="animate-fade overflow-hidden">
            <ReviewTotals
              totals={totals}
              pricing={data.reviewPanel.pricing}
              currency={data.bundle.currency}
              locale={data.bundle.locale}
            />
          </div>
        )}

        <div className="mt-1 space-y-2">
          <Button
            type="button"
            onClick={() =>
              toast.warning("Checkout is currently disabled from this screen.")
            }
            className="w-full h-11 text-sm font-bold bg-primary text-white hover:text-primary relative overflow-hidden z-10 before:absolute before:-z-10 before:bg-white before:w-full before:aspect-square before:rounded-full before:transition-all before:duration-700 before:-right-full hover:before:right-0 hover:before:scale-150"
            disabled={!hasItems}
          >
            {data.reviewPanel.actions.checkoutLabel}
          </Button>

          <Button
            type="button"
            variant="ghost"
            disabled={!hasItems}
            onClick={() => {
              onSave();
              toast.success("Bundle saved for later!");
            }}
            className="w-full text-center text-xs font-bold text-muted underline hover:text-slate-900 transition disabled:pointer-events-none disabled:opacity-50"
          >
            {data.reviewPanel.actions.saveLabel}
          </Button>
        </div>
      </div>
    </aside>
  );
}
