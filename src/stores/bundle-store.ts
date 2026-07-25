import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import bundleData from "@/data/bundle-data.json";
import type {
  BundleData,
  BundleLine,
  BundleProduct,
  BundleStep,
  ProductId,
  StepId,
  VariantId,
} from "@/features/bundle/bundle.types";
import { getCartLineId, removeCartLine, upsertCartLine } from "@/lib/cart-line";

const data = bundleData as BundleData;

const findProduct = (productId: ProductId): BundleProduct | undefined => {
  return data.products.find((p) => p.id === productId);
};

const findStepByProduct = (product: BundleProduct): BundleStep | undefined => {
  return data.steps.find((s) => s.productIds.includes(product.id));
};

const clampQuantity = (quantity: number, product: BundleProduct): number => {
  const effectiveMin = product.required
    ? Math.max(product.rules.minQty, 1)
    : product.rules.minQty;
  return Math.max(effectiveMin, Math.min(product.rules.maxQty, quantity));
};

const removeLinesByStep = (
  lines: BundleLine[],
  stepId: StepId,
): BundleLine[] => {
  const step = data.steps.find((s) => s.id === stepId);
  if (!step) return lines;

  return lines.filter((line) => !step.productIds.includes(line.productId));
};

export interface BundleStoreState {
  activeStepId: StepId;
  activeVariants: Record<ProductId, VariantId>;
  lines: BundleLine[];

  setActiveStep: (stepId: StepId | null) => void;
  setActiveVariant: (productId: ProductId, variantId: VariantId) => void;
  setLineQuantity: (
    productId: ProductId,
    variantId: VariantId | null,
    quantity: number,
  ) => void;
  removeLine: (productId: ProductId, variantId: VariantId | null) => void;
  resetBundle: () => void;
}

export const createBundleStore = () => {
  return createStore<BundleStoreState>()(
    persist(
      (set) => ({
        ...data.initialState,

        setActiveStep: (stepId: StepId | null) => {
          set((state) => ({
            activeStepId: state.activeStepId === stepId ? "" : (stepId ?? ""),
          }));
        },

        setActiveVariant: (productId: ProductId, variantId: VariantId) => {
          set((state) => ({
            activeVariants: { ...state.activeVariants, [productId]: variantId },
          }));
        },

        setLineQuantity: (
          productId: ProductId,
          variantId: VariantId | null,
          quantity: number,
        ) => {
          set((state) => {
            const product = findProduct(productId);
            if (!product) return state;

            const clamped = clampQuantity(quantity, product);

            if (clamped <= 0) {
              return {
                lines: removeCartLine(state.lines, productId, variantId),
              };
            }

            const step = findStepByProduct(product);
            if (!step) return state;

            const newLine: BundleLine = {
              id: getCartLineId(productId, variantId),
              productId,
              variantId,
              quantity: clamped,
            };

            if (step.selectionMode === "single") {
              const cleared = removeLinesByStep(state.lines, step.id);
              return { lines: upsertCartLine(cleared, newLine) };
            }

            return {
              lines: upsertCartLine(state.lines, newLine),
            };
          });
        },

        removeLine: (productId: ProductId, variantId: VariantId | null) => {
          set((state) => ({
            lines: removeCartLine(state.lines, productId, variantId),
          }));
        },

        resetBundle: () => {
          set(data.initialState);
        },
      }),
      {
        name: data.bundle.storageKey,
        storage: createJSONStorage(() => localStorage),
        skipHydration: true,
        partialize: (state) => ({
          activeStepId: state.activeStepId,
          activeVariants: state.activeVariants,
          lines: state.lines,
        }),
      },
    ),
  );
};
