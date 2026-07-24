"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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
    product.variants[0] ??
    null;

  const isSelected = quantity > 0;
  const unitPrice = activeVariant?.price ?? product.price ?? 0;
  const comparePrice = activeVariant?.compareAtPrice ?? product.compareAtPrice ?? null;
  const showCompare = hasSavings(comparePrice, unitPrice);
  const effectiveQty = Math.max(1, quantity);
  const compareTotal = (comparePrice ?? 0) * effectiveQty;
  const discountBadge =
    comparePrice !== null && comparePrice > unitPrice
      ? `Save ${Math.floor(((comparePrice - unitPrice) / comparePrice) * 100)}%`
      : null;

  return (
    <article
      className={cn(
        "flex items-center gap-3 sm:gap-4 rounded-md border-none bg-white p-2.5 transition-all duration-200 w-full h-full relative",
        isSelected ? "border-[#4E2FD2B2] ring-2 ring-[#4E2FD2B2]" : "border-line-soft",
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

      {discountBadge && (
        <Badge
          className="absolute top-2 left-2 w-fit rounded-full px-2 py-0.5 text-[10px] font-medium capitalize tracking-wide bg-[#4E2FD2]"
        >
          {discountBadge}
        </Badge>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col min-w-0 gap-2">

        <h3 className="text-base font-bold text-[#1F1F1F] leading-tight line-clamp-1">
          {product.name}
        </h3>

        <p className="text-xs leading-relaxed text-[#1F1F1FBF] line-clamp-3 font-medium text-pretty">
          {product.description}{" "}
          <a
            href={product.learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0000EE] underline hover:text-blue-800 inline"
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

          <div className="flex flex-col items-end shrink-0 relative ">
            {showCompare && (
              <Price
                key={`compare-${compareTotal}`}
                amount={compareTotal}
                currency={currency}
                locale={locale}
                className="text-[#D8392B] line-through leading-tight"
              />
            )}
            <Price
              key={`price-${unitPrice * effectiveQty}`}
              amount={unitPrice * effectiveQty}
              currency={currency}
              locale={locale}
              className="text-heading leading-tight"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
