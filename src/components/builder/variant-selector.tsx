"use client";

import Image from "next/image";
import type { ProductVariant, VariantId } from "@/features/bundle/bundle.types";
import { getVariantImage } from "@/lib/image-resolver";
import { cn } from "@/lib/utils";

interface VariantSelectorProps {
  variants: ProductVariant[];
  value: VariantId | null;
  className?: string;
  onChange: (variantId: VariantId) => void;
}

function VariantSwatch({
  variant,
  className,
}: {
  variant: ProductVariant;
  className?: string;
}) {
  const img = getVariantImage(variant);

  if (img) {
    return (
      <Image
        src={img}
        alt={variant.label}
        width={22}
        height={22}
        className={cn("size-[22px] rounded-full object-contain", className)}
      />
    );
  }

  if (variant.swatch) {
    return (
      <span
        className={cn(
          "size-[22px] rounded-full border border-line-soft shrink-0",
          className,
        )}
        style={{ backgroundColor: variant.swatch }}
        title={variant.label}
      />
    );
  }

  return null;
}

export function VariantSelector({
  variants,
  value,
  className,
  onChange,
}: VariantSelectorProps) {
  if (variants.length <= 1) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {variants.map((variant) => {
        const isActive = variant.id === value;

        return (
          <button
            key={variant.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(variant.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xs border px-1 py-0.5 font-bold transition-colors",
              isActive
                ? "border-success bg-[#f2fcf9] text-heading"
                : "border-line-soft bg-white text-heading hover:border-success/50",
            )}
          >
            <VariantSwatch variant={variant} />
            <span className="text-[10px]">{variant.label}</span>
          </button>
        );
      })}
    </div>
  );
}
