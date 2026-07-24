import type {
  BundleLine,
  ProductId,
  VariantId,
} from "@/features/bundle/bundle.types";

export const getCartLineId = (
  productId: ProductId,
  variantId: VariantId | null,
): string => {
  return `${productId}:${variantId ?? ""}`;
};

export const isSameCartLine = (
  line: BundleLine,
  productId: ProductId,
  variantId: VariantId | null,
): boolean => {
  return line.productId === productId && line.variantId === variantId;
};

export const findCartLine = (
  lines: BundleLine[],
  productId: ProductId,
  variantId: VariantId | null,
): BundleLine | undefined => {
  return lines.find((line) => isSameCartLine(line, productId, variantId));
};

export const removeCartLine = (
  lines: BundleLine[],
  productId: ProductId,
  variantId: VariantId | null,
): BundleLine[] => {
  return lines.filter((line) => !isSameCartLine(line, productId, variantId));
};

export const upsertCartLine = (
  lines: BundleLine[],
  nextLine: BundleLine,
): BundleLine[] => {
  const existing = lines.findIndex(
    (line) =>
      line.productId === nextLine.productId &&
      line.variantId === nextLine.variantId,
  );

  if (existing === -1) {
    return [...lines, nextLine];
  }

  const updated = [...lines];
  updated[existing] = nextLine;
  return updated;
};
