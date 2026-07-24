"use client";

import {
  getActiveVariantId,
  getLineQuantity,
} from "@/features/bundle/bundle.selectors";
import type {
  BundleProduct,
  BundleState,
  ProductId,
  VariantId,
} from "@/features/bundle/bundle.types";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: BundleProduct[];
  state: BundleState;
  currency: string;
  locale: string;
  onVariantChange: (productId: ProductId, variantId: VariantId) => void;
  onQuantityChange: (
    productId: ProductId,
    variantId: VariantId | null,
    quantity: number,
  ) => void;
}

export function ProductGrid({
  products,
  state,
  currency,
  locale,
  onVariantChange,
  onQuantityChange,
}: ProductGridProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {products.map((product) => {
        const activeVariantId = getActiveVariantId(state, product);
        const quantity = getLineQuantity(state, product.id, activeVariantId);

        return (
          <div key={product.id} className="w-full h-auto sm:w-[calc(50%-0.5rem)]">
            <ProductCard
              product={product}
              currency={currency}
              locale={locale}
              activeVariantId={activeVariantId}
              quantity={quantity}
              onVariantChange={(variantId) =>
                onVariantChange(product.id, variantId)
              }
              onQuantityChange={(q) =>
                onQuantityChange(product.id, activeVariantId, q)
              }
            />
          </div>
        );
      })}
    </div>
  );
}
