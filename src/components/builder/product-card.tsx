"use client";

import Image from "next/image";
import { Price } from "@/components/ui/price";
import type { BundleProduct, VariantId } from "@/features/bundle/bundle.types";
import { getProductImage } from "@/lib/image-resolver";
import { hasSavings } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { QuantityStepper } from "./quantity-stepper";
import { VariantSelector } from "./variant-selector";

interface ProductCardProps {
  product: BundleProduct;
  currency: string;
  locale: string;
  activeVariantId: VariantId | null;
  quantity: number;
  className?: string;
  onVariantChange: (variantId: VariantId) => void;
  onQuantityChange: (quantity: number) => void;
}

export function ProductCard({
  product,
  currency,
  locale,
  activeVariantId,
  quantity,
  className,
  onVariantChange,
  onQuantityChange,
}: ProductCardProps) {
  const activeVariant =
    product.variants.find((v) => v.id === activeVariantId) ??
    product.variants[0];

  if (!activeVariant) return null;

  const isSelected = quantity > 0;
  const comparePrice = activeVariant.compareAtPrice;
  const showCompare = hasSavings(comparePrice, activeVariant.price);
  const effectiveQty = Math.max(1, quantity);
  const compareTotal = (comparePrice ?? 0) * effectiveQty;

  return (
    <article
      className={cn(
        "flex gap-3 sm:gap-4 rounded-md border bg-white p-2.5 transition-all duration-200",
        isSelected ? "border-primary ring-1 ring-primary" : "border-line-soft",
        className,
      )}
    >
      {/* Image */}
      <div className="relative w-[80px] sm:w-[110px] shrink-0 flex items-center justify-center">
        <Image
          src={getProductImage(product)}
          alt={product.name}
          width={110}
          height={110}
          className="w-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col min-w-0 gap-2">
        <h3 className="text-sm font-bold text-heading leading-tight line-clamp-1">
          {product.name}
        </h3>

        <p className="text-xs leading-relaxed text-muted line-clamp-3">
          {product.description}{" "}
          <a
            href={product.learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-blue-600 underline hover:text-blue-800 inline"
          >
            Learn More
          </a>
        </p>

        {product.variants.length > 1 && (
          <VariantSelector
            variants={product.variants}
            value={activeVariantId}
            onChange={onVariantChange}
          />
        )}

        {/* Bottom row: quantity + price */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <QuantityStepper
            value={quantity}
            min={product.rules.minQty}
            max={product.rules.maxQty}
            required={product.required}
            onChange={onQuantityChange}
          />

          <div className="flex flex-col items-end shrink-0 relative">
            {showCompare && (
              <Price
                key={`compare-${compareTotal}`}
                amount={compareTotal}
                currency={currency}
                locale={locale}
                className="text-[var(--color-danger)] line-through"
              />
            )}
            <Price
              key={`price-${activeVariant.price * effectiveQty}`}
              amount={activeVariant.price * effectiveQty}
              currency={currency}
              locale={locale}
              className="text-heading"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
