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

function GuaranteeSeal({ width }: { width: number }) {
  return (
    <div
      className="relative shrink-0 select-none flex items-center justify-center"
      style={{ width }}
    >
      <img
        src="/Satisfaction_Badge.svg"
        alt="100% Wyze Guarantee"
        className="size-full object-contain"
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
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[5px] bg-white">
          <img
            src="/carbon_delivery.svg"
            alt="Delivery"
            className="size-7 object-contain"
          />
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
            <span className="text-[13px] font-semibold leading-none text-[#4E2FD2] tabular-nums uppercase">
              {pricing.freeLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Guarantee + Subtotal */}
      <div className="flex items-center justify-between gap-4">
        <GuaranteeSeal width={pricing.guaranteeWidth} />

        <div className="flex flex-col items-end text-right overflow-hidden relative">
          <div className="relative min-h-6">
            <div
              key={financingAmount}
              className="animate-fade-scale rounded-[3px] bg-[#4E2FD2] px-2 py-0.5 text-xs font-medium text-white mb-2 inline-block"
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
                className="text-lg font-medium text-[#6F7882] line-through overflow-hidden whitespace-nowrap tabular-nums"
              />
            )}

            <Price
              amount={totals.subtotal}
              currency={currency}
              locale={locale}
              className="text-2xl font-bold text-[#4E2FD2] leading-none whitespace-nowrap tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Savings Message */}
      {hasSavings && (
        <div
          key={totals.savings}
          className="animate-fade-scale text-center text-[12px] font-medium text-success pt-3 tabular-nums"
        >
          {/* {pricing.savingsLabel}{" "} */}
          Congrats! You’re saving {" "}
          {formatMoney(totals.savings, { currency, locale })}
          {" "} on your security bundle!
        </div>
      )}
    </div>
  );
}
