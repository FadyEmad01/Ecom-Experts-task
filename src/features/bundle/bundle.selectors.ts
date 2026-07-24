import {
  getCompareLineTotal,
  getFinancingAmount,
  getLineTotal,
  getSavingsAmount,
} from "@/lib/pricing";
import type {
  BundleData,
  BundleLine,
  BundleProduct,
  BundleState,
  BundleTotals,
  ProductId,
  ResolvedBundleLine,
  VariantId,
} from "./bundle.types";

export const getProductById = (
  data: BundleData,
  productId: ProductId,
): BundleProduct | undefined => {
  return data.products.find((p) => p.id === productId);
};

export const getVariantById = (
  product: BundleProduct,
  variantId: VariantId,
) => {
  return product.variants.find((v) => v.id === variantId) ?? null;
};

export const getProductsByStepId = (
  data: BundleData,
  stepId: string,
): BundleProduct[] => {
  const step = data.steps.find((s) => s.id === stepId);
  if (!step) return [];

  return step.productIds
    .map((id) => getProductById(data, id))
    .filter((p): p is BundleProduct => p !== undefined);
};

export const getActiveVariantId = (
  state: BundleState,
  product: BundleProduct,
): VariantId | null => {
  if (product.variants.length === 0) return null;
  return state.activeVariants[product.id] ?? product.variants[0]?.id ?? null;
};

export const getLineQuantity = (
  state: BundleState,
  productId: ProductId,
  variantId: VariantId,
): number => {
  const line = state.lines.find(
    (l) => l.productId === productId && l.variantId === variantId,
  );
  return line?.quantity ?? 0;
};

export const getResolvedBundleLines = (
  data: BundleData,
  lines: BundleLine[],
): ResolvedBundleLine[] => {
  return lines
    .map((line) => {
      const product = getProductById(data, line.productId);
      if (!product) return null;

      const variant = line.variantId
        ? getVariantById(product, line.variantId)
        : null;

      const unitPrice = variant?.price ?? 0;
      const unitCompareAtPrice = variant?.compareAtPrice ?? null;

      return {
        line,
        product,
        variant,
        lineTotal: getLineTotal(unitPrice, line.quantity),
        compareLineTotal:
          unitCompareAtPrice !== null
            ? getCompareLineTotal(unitPrice, unitCompareAtPrice, line.quantity)
            : null,
      };
    })
    .filter((r): r is ResolvedBundleLine => r !== null);
};

export const getResolvedLinesByGroup = (
  data: BundleData,
  resolvedLines: ResolvedBundleLine[],
  groupId: string,
): ResolvedBundleLine[] => {
  const step = data.steps.find((s) => s.id === groupId);
  if (!step) return [];

  return resolvedLines.filter((rl) =>
    step.productIds.includes(rl.line.productId),
  );
};

export const getBundleTotals = (
  resolvedLines: ResolvedBundleLine[],
): BundleTotals => {
  const subtotal = resolvedLines.reduce((acc, rl) => acc + rl.lineTotal, 0);

  const compareSubtotal = resolvedLines.reduce(
    (acc, rl) => acc + (rl.compareLineTotal ?? rl.lineTotal),
    0,
  );

  const savings = getSavingsAmount(compareSubtotal, subtotal);
  const financing = getFinancingAmount(subtotal);

  return {
    subtotal,
    compareSubtotal,
    savings,
    financing,
    shipping: 0,
  };
};

export const hasSelectedLines = (state: BundleState): boolean => {
  return state.lines.length > 0;
};

export const isProductSelected = (
  state: BundleState,
  productId: ProductId,
): boolean => {
  return state.lines.some((line) => line.productId === productId);
};
