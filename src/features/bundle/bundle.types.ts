export type StepId = string;
export type ProductId = string;
export type VariantId = string;
export type LineId = string;

export interface BundleMetadata {
  id: string;
  title: string;
  currency: string;
  locale: string;
  storageKey: string;
}

export interface BundleStep {
  id: StepId;
  stepNumber: number;
  title: string;
  icon: string;
  selectionMode: "single" | "multi";
  productIds: ProductId[];
}

export interface ProductVariant {
  id: VariantId;
  sku: string;
  label: string;
  swatch: string | null;
  price: number;
  compareAtPrice: number | null;
  image?: string;
}

export interface ProductRules {
  minQty: number;
  maxQty: number;
  defaultQty: number;
}

export interface BundleProduct {
  id: ProductId;
  name: string;
  description: string;
  image?: string;
  learnMoreUrl: string;
  price?: number;
  compareAtPrice?: number | null;
  rules: ProductRules;
  variants: ProductVariant[];
  required?: boolean;
}

export interface ReviewPanelEmptyState {
  title: string;
  description: string;
  icon: string;
}

export interface ReviewPanelPricing {
  shippingLabel: string;
  freeLabel: string;
  subtotalLabel: string;
  savingsLabel: string;
  financingLabel: string;
  guaranteeImage: string;
  guaranteeWidth: number;
}

export interface ReviewPanelActions {
  checkoutLabel: string;
  saveLabel: string;
}

export interface ReviewGroupConfig {
  stepId: StepId;
  label: string;
}

export interface ReviewPanelConfig {
  emptyState: ReviewPanelEmptyState;
  titles: Record<StepId, string>;
  groups: ReviewGroupConfig[];
  pricing: ReviewPanelPricing;
  actions: ReviewPanelActions;
}

export interface BundleLine {
  id: LineId;
  productId: ProductId;
  variantId: VariantId | null;
  quantity: number;
}

export interface BundleState {
  activeStepId: StepId;
  activeVariants: Record<ProductId, VariantId>;
  lines: BundleLine[];
}

export interface BundleData {
  bundle: BundleMetadata;
  steps: BundleStep[];
  products: BundleProduct[];
  reviewPanel: ReviewPanelConfig;
  initialState: BundleState;
}

export interface ResolvedBundleLine {
  line: BundleLine;
  product: BundleProduct;
  variant: ProductVariant | null;
  lineTotal: number;
  compareLineTotal: number | null;
}

export interface BundleTotals {
  subtotal: number;
  compareSubtotal: number | null;
  savings: number;
  financing: number;
  shipping: number;
}
