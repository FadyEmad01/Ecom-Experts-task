import Image from "next/image";
import { QuantityStepper } from "@/components/builder/quantity-stepper";
import { Price } from "@/components/ui/price";
import type { ResolvedBundleLine } from "@/features/bundle/bundle.types";
import { getProductImage } from "@/lib/image-resolver";

interface ReviewLineItemProps {
  line: ResolvedBundleLine;
  currency: string;
  locale: string;
  onQuantityChange: (quantity: number) => void;
}

export function ReviewLineItem({
  line,
  currency,
  locale,
  onQuantityChange,
}: ReviewLineItemProps) {
  const imageSrc = getProductImage(line.product);
  const showCompare =
    line.compareLineTotal !== null && line.compareLineTotal > line.lineTotal;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-line-soft/50">
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded bg-white">
        <Image
          src={imageSrc}
          alt={line.product.name}
          className="size-full object-contain p-1"
          loading="lazy"
          width={40}
          height={40}
        />
      </div>

      <div className="flex-1 min-w-0 pr-2">
        <h3 className="truncate text-[13px] font-medium text-heading">
          {line.product.name}
          {line.product.required && (
            <span className="text-muted ml-1">(Required)</span>
          )}
        </h3>
      </div>

      <div className="shrink-0 flex items-center gap-4">
        <QuantityStepper
          value={line.line.quantity}
          inReview={true}
          min={1}
          max={99}
          onChange={onQuantityChange}
        />

        <div className="flex flex-col items-end text-right shrink-0">
          {showCompare && (
            <Price
              key={`compare-${line.compareLineTotal}`}
              amount={line.compareLineTotal ?? 0}
              currency={currency}
              locale={locale}
              className="text-[11px] font-medium text-muted-light line-through leading-none mb-0.5"
            />
          )}

          <Price
            key={`total-${line.lineTotal}`}
            amount={line.lineTotal}
            currency={currency}
            locale={locale}
            className="text-[13px] font-semibold leading-none text-primary"
          />
        </div>
      </div>
    </div>
  );
}
