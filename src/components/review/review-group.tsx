import type {
  ProductId,
  ResolvedBundleLine,
  ReviewGroupConfig,
  VariantId,
} from "@/features/bundle/bundle.types";
import { ReviewLineItem } from "./review-line-item";

interface ReviewGroupProps {
  group: ReviewGroupConfig;
  lines: ResolvedBundleLine[];
  currency: string;
  locale: string;
  onQuantityChange: (
    productId: ProductId,
    variantId: VariantId | null,
    quantity: number,
  ) => void;
}

export function ReviewGroup({
  group,
  lines,
  currency,
  locale,
  onQuantityChange,
}: ReviewGroupProps) {
  return (
    <section>
      <h3 className="mb-0 text-xs font-normal uppercase text-muted-light tracking-wide">
        {group.label}
      </h3>

      <div className="flex flex-col relative">
        {lines.map((line) => (
          <ReviewLineItem
            key={line.line.id}
            line={line}
            currency={currency}
            locale={locale}
            onQuantityChange={(quantity) => {
              onQuantityChange(
                line.line.productId,
                line.line.variantId,
                quantity,
              );
            }}
          />
        ))}
      </div>
    </section>
  );
}
