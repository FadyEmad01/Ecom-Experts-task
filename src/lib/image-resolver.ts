import type { StaticImageData } from "next/image";
import { imageByPath } from "@/assets/images";
import placeholderImg from "@/assets/products/sensors/Wyze Sense Hub.png";
import type {
  BundleProduct,
  ProductVariant,
} from "@/features/bundle/bundle.types";

export function getProductImage(
  product: BundleProduct,
): StaticImageData | string {
  if (product.image) {
    if (product.image.startsWith("/")) {
      return product.image;
    }
    if (product.image in imageByPath) {
      return imageByPath[product.image];
    }
  }
  return placeholderImg;
}

export function getVariantImage(
  variant: ProductVariant,
): StaticImageData | string | null {
  if (variant.image) {
    if (variant.image.startsWith("/")) {
      return variant.image;
    }
    if (variant.image in imageByPath) {
      return imageByPath[variant.image];
    }
  }
  return null;
}

export function hasVariantImage(variant: ProductVariant): boolean {
  return Boolean(variant.image);
}
