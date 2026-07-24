import { TruckElectric } from "lucide-react";
import { Price } from "@/components/ui/price";
import type {
  BundleTotals,
  ReviewPanelPricing,
} from "@/features/bundle/bundle.types";
import { formatMoney } from "@/lib/format-money";
import { getFinancingAmount } from "@/lib/pricing";

interface ReviewTotalsProps {
  totals: BundleTotals;
  pricing: ReviewPanelPricing;
  currency: string;
  locale: string;
}

function GuaranteeSeal({ image, width }: { image: string; width: number }) {
  return (
    <div
      className="relative shrink-0 select-none flex items-center justify-center"
      style={{ width }}
    >
      <img
        src={image}
        alt="100% Wyze Guarantee"
        className="absolute inset-0 size-full object-contain"
      />
    </div>
  );
}

export function ReviewTotals({
  totals,
  pricing,
  currency,
  locale,
}: ReviewTotalsProps) {
  const hasSavings = totals.savings > 0;
  const financingAmount = getFinancingAmount(totals.subtotal);
  const formattedFinancingAmount = formatMoney(financingAmount, {
    currency,
    locale,
  });

  const financingText = pricing.financingLabel.replace(
    "{amount}",
    formattedFinancingAmount,
  );

  return (
    <div>
      {/* Shipping Row */}
      <div className="flex items-center gap-3 py-3">
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded bg-white">
          <TruckElectric className="size-7 text-success" strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <h3 className="truncate text-[13px] font-medium text-heading">
            {pricing.shippingLabel}
          </h3>
        </div>

        <div className="shrink-0 flex items-center gap-4">
          <div className="flex flex-col items-end text-right shrink-0">
            <span className="text-[11px] font-medium text-muted-light line-through leading-none mb-0.5">
              $5.99
            </span>
            <span className="text-[13px] font-semibold leading-none text-primary tabular-nums uppercase">
              {pricing.freeLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Guarantee + Subtotal */}
      <div className="flex items-center justify-between gap-4">
        <GuaranteeSeal
          image={pricing.guaranteeImage}
          width={pricing.guaranteeWidth}
        />

        <div className="flex flex-col items-end text-right overflow-hidden relative">
          <div className="relative min-h-6">
            <div
              key={financingAmount}
              className="animate-fade-scale rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-white mb-2 inline-block"
            >
              {financingText}
            </div>
          </div>

          <div className="flex items-baseline justify-end gap-2 relative w-full">
            {hasSavings && totals.compareSubtotal !== null && (
              <Price
                amount={totals.compareSubtotal}
                currency={currency}
                locale={locale}
                className="text-sm font-medium text-muted-light line-through overflow-hidden whitespace-nowrap tabular-nums"
              />
            )}

            <Price
              amount={totals.subtotal}
              currency={currency}
              locale={locale}
              className="text-2xl font-extrabold text-primary leading-none whitespace-nowrap tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Savings Message */}
      {hasSavings && (
        <div
          key={totals.savings}
          className="animate-fade-scale text-center text-[12px] font-semibold text-success pt-3 tabular-nums"
        >
          {pricing.savingsLabel}{" "}
          {formatMoney(totals.savings, { currency, locale })}
        </div>
      )}
    </div>
  );
}
