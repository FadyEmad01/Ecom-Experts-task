"use client";

import { formatMoney } from "@/lib/format-money";
import { cn } from "@/lib/utils";

interface PriceProps {
  amount: number;
  currency: string;
  locale: string;
  suffix?: string;
  className?: string;
}

export function Price({
  amount,
  currency,
  locale,
  suffix,
  className,
}: PriceProps) {
  return (
    <span
      className={cn(
        "relative font-normal tabular-nums leading-none text-base inline-flex items-baseline",
        className,
      )}
    >
      <span key={amount} className="animate-fade-scale inline-block">
        {formatMoney(amount, {
          currency,
          locale,
          freeLabel: "FREE",
        })}
      </span>
      {suffix ? <span className="ml-0.5">{suffix}</span> : null}
    </span>
  );
}
