import {
  getActiveVariantId,
  getBundleTotals,
  getLineQuantity,
  getProductById,
  getProductsByStepId,
  getResolvedBundleLines,
  getResolvedLinesByGroup,
  getVariantById,
  hasSelectedLines,
  isProductSelected,
} from "../bundle.selectors";
import type {
  BundleData,
  BundleLine,
  BundleProduct,
  BundleState,
  ProductId,
  ResolvedBundleLine,
  VariantId,
} from "../bundle.types";

const makeVariant = (
  overrides: Partial<import("../bundle.types").ProductVariant> = {},
): import("../bundle.types").ProductVariant => ({
  id: "v1",
  sku: "SKU-1",
  label: "Variant 1",
  swatch: null,
  price: 29.99,
  compareAtPrice: null,
  ...overrides,
});

const makeProduct = (
  overrides: Partial<BundleProduct> = {},
): BundleProduct => ({
  id: "prod-1",
  name: "Product One",
  description: "A product",
  learnMoreUrl: "https://example.com",
  rules: { minQty: 1, maxQty: 5, defaultQty: 1 },
  variants: [makeVariant()],
  ...overrides,
});

const makeLine = (overrides: Partial<BundleLine> = {}): BundleLine => ({
  id: "line-1",
  productId: "prod-1",
  variantId: "v1",
  quantity: 1,
  ...overrides,
});

const makeState = (overrides: Partial<BundleState> = {}): BundleState => ({
  activeStepId: "step-1",
  activeVariants: {},
  lines: [],
  ...overrides,
});

const makeData = (overrides: Partial<BundleData> = {}): BundleData => ({
  bundle: {
    id: "bundle-1",
    title: "Test Bundle",
    currency: "USD",
    locale: "en-US",
    storageKey: "test-key",
  },
  steps: [
    {
      id: "step-1",
      stepNumber: 1,
      title: "Step One",
      icon: "icon.svg",
      selectionMode: "single",
      productIds: ["prod-1", "prod-2"],
    },
  ],
  products: [
    makeProduct({ id: "prod-1" }),
    makeProduct({ id: "prod-2", name: "Product Two" }),
  ],
  reviewPanel: {
    emptyState: { title: "", description: "", icon: "" },
    titles: {},
    groups: [],
    pricing: {
      shippingLabel: "Shipping",
      freeLabel: "Free",
      subtotalLabel: "Subtotal",
      savingsLabel: "Savings",
      financingLabel: "Financing",
      guaranteeImage: "guarantee.svg",
      guaranteeWidth: 100,
    },
    actions: { checkoutLabel: "Checkout", saveLabel: "Save" },
  },
  initialState: makeState(),
  ...overrides,
});

describe("getProductById", () => {
  it("returns the product when found", () => {
    const data = makeData();
    const result = getProductById(data, "prod-1");
    expect(result).toBeDefined();
    expect(result?.id).toBe("prod-1");
    expect(result?.name).toBe("Product One");
  });

  it("returns undefined when not found", () => {
    const data = makeData();
    const result = getProductById(data, "nonexistent" as ProductId);
    expect(result).toBeUndefined();
  });
});

describe("getVariantById", () => {
  it("returns the variant when found", () => {
    const variant = makeVariant({ id: "v-abc" });
    const product = makeProduct({ variants: [variant] });
    const result = getVariantById(product, "v-abc" as VariantId);
    expect(result).toEqual(variant);
  });

  it("returns null when variant is not found", () => {
    const product = makeProduct({ variants: [makeVariant({ id: "v-abc" })] });
    const result = getVariantById(product, "v-missing" as VariantId);
    expect(result).toBeNull();
  });

  it("returns null when product has an empty variants array", () => {
    const product = makeProduct({ variants: [] });
    const result = getVariantById(product, "v-abc" as VariantId);
    expect(result).toBeNull();
  });
});

describe("getProductsByStepId", () => {
  it("returns products for a valid step", () => {
    const data = makeData();
    const result = getProductsByStepId(data, "step-1");
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("prod-1");
    expect(result[1].id).toBe("prod-2");
  });

  it("returns an empty array for an invalid stepId", () => {
    const data = makeData();
    const result = getProductsByStepId(data, "nonexistent-step");
    expect(result).toEqual([]);
  });

  it("filters out products with non-existent productIds", () => {
    const data = makeData({
      steps: [
        {
          id: "step-mix",
          stepNumber: 1,
          title: "Mix",
          icon: "icon.svg",
          selectionMode: "single",
          productIds: ["prod-1", "prod-ghost"],
        },
      ],
    });
    const result = getProductsByStepId(data, "step-mix");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("prod-1");
  });
});

describe("getActiveVariantId", () => {
  it("returns null when the product has no variants", () => {
    const state = makeState();
    const product = makeProduct({ variants: [] });
    expect(getActiveVariantId(state, product)).toBeNull();
  });

  it("returns the first variant id when no override exists", () => {
    const state = makeState();
    const product = makeProduct({
      variants: [
        makeVariant({ id: "v-first" }),
        makeVariant({ id: "v-second" }),
      ],
    });
    expect(getActiveVariantId(state, product)).toBe("v-first");
  });

  it("returns the override variant id when one is set", () => {
    const state = makeState({
      activeVariants: { "prod-1": "v-second" },
    });
    const product = makeProduct({
      id: "prod-1",
      variants: [
        makeVariant({ id: "v-first" }),
        makeVariant({ id: "v-second" }),
      ],
    });
    expect(getActiveVariantId(state, product)).toBe("v-second");
  });
});

describe("getLineQuantity", () => {
  it("returns the quantity when a matching line exists", () => {
    const state = makeState({
      lines: [
        makeLine({
          productId: "p1",
          variantId: "v1" as VariantId,
          quantity: 3,
        }),
      ],
    });
    expect(getLineQuantity(state, "p1", "v1" as VariantId)).toBe(3);
  });

  it("returns 0 when no matching line exists", () => {
    const state = makeState();
    expect(getLineQuantity(state, "p1", "v1" as VariantId)).toBe(0);
  });
});

describe("getResolvedBundleLines", () => {
  it("resolves lines with variants to full ResolvedBundleLine objects", () => {
    const data = makeData({
      products: [
        makeProduct({
          id: "p1",
          variants: [makeVariant({ id: "v1", price: 20 })],
        }),
      ],
    });
    const lines = [
      makeLine({ productId: "p1", variantId: "v1" as VariantId, quantity: 2 }),
    ];
    const result = getResolvedBundleLines(data, lines);
    expect(result).toHaveLength(1);
    expect(result[0].lineTotal).toBe(40);
    expect(result[0].product.id).toBe("p1");
    expect(result[0].variant?.id).toBe("v1");
  });

  it("filters out lines whose product does not exist in data", () => {
    const data = makeData({ products: [] });
    const lines = [makeLine({ productId: "ghost" as ProductId })];
    const result = getResolvedBundleLines(data, lines);
    expect(result).toEqual([]);
  });

  it("sets variant to null and unitPrice to 0 when variantId is null", () => {
    const data = makeData({
      products: [
        makeProduct({
          id: "p1",
          variants: [makeVariant({ id: "v1", price: 50 })],
        }),
      ],
    });
    const lines = [makeLine({ productId: "p1", variantId: null, quantity: 1 })];
    const result = getResolvedBundleLines(data, lines);
    expect(result).toHaveLength(1);
    expect(result[0].variant).toBeNull();
    expect(result[0].lineTotal).toBe(0);
  });

  it("calculates compareLineTotal when variant has a compareAtPrice", () => {
    const data = makeData({
      products: [
        makeProduct({
          id: "p1",
          variants: [makeVariant({ id: "v1", price: 20, compareAtPrice: 30 })],
        }),
      ],
    });
    const lines = [
      makeLine({ productId: "p1", variantId: "v1" as VariantId, quantity: 3 }),
    ];
    const result = getResolvedBundleLines(data, lines);
    expect(result).toHaveLength(1);
    expect(result[0].lineTotal).toBe(60);
    expect(result[0].compareLineTotal).toBe(90);
  });

  it("sets compareLineTotal to null when variant compareAtPrice is null", () => {
    const data = makeData({
      products: [
        makeProduct({
          id: "p1",
          variants: [
            makeVariant({ id: "v1", price: 25, compareAtPrice: null }),
          ],
        }),
      ],
    });
    const lines = [
      makeLine({ productId: "p1", variantId: "v1" as VariantId, quantity: 2 }),
    ];
    const result = getResolvedBundleLines(data, lines);
    expect(result).toHaveLength(1);
    expect(result[0].compareLineTotal).toBeNull();
  });
});

describe("getResolvedLinesByGroup", () => {
  const makeResolved = (
    productId: string,
    lineTotal: number,
  ): ResolvedBundleLine => ({
    line: makeLine({ productId }),
    product: makeProduct({ id: productId }),
    variant: null,
    lineTotal,
    compareLineTotal: null,
  });

  it("returns only lines whose productId is in the step's productIds", () => {
    const data = makeData();
    const resolved = [makeResolved("prod-1", 10), makeResolved("prod-2", 20)];
    const result = getResolvedLinesByGroup(data, resolved, "step-1");
    expect(result).toHaveLength(2);
  });

  it("returns an empty array for an invalid groupId", () => {
    const data = makeData();
    const resolved = [makeResolved("prod-1", 10)];
    const result = getResolvedLinesByGroup(data, resolved, "no-such-step");
    expect(result).toEqual([]);
  });

  it("returns an empty array when no lines match the group", () => {
    const data = makeData({
      steps: [
        {
          id: "step-empty",
          stepNumber: 1,
          title: "Empty",
          icon: "icon.svg",
          selectionMode: "single",
          productIds: ["prod-99"],
        },
      ],
    });
    const resolved = [makeResolved("prod-1", 10)];
    const result = getResolvedLinesByGroup(data, resolved, "step-empty");
    expect(result).toEqual([]);
  });
});

describe("getBundleTotals", () => {
  it("calculates subtotal, compareSubtotal, savings, financing, and shipping=0", () => {
    const resolved: ResolvedBundleLine[] = [
      {
        line: makeLine({ quantity: 2 }),
        product: makeProduct(),
        variant: makeVariant({ price: 20, compareAtPrice: 30 }),
        lineTotal: 40,
        compareLineTotal: 60,
      },
      {
        line: makeLine({ id: "line-2", quantity: 1 }),
        product: makeProduct(),
        variant: makeVariant({ price: 10, compareAtPrice: null }),
        lineTotal: 10,
        compareLineTotal: null,
      },
    ];
    const totals = getBundleTotals(resolved);
    expect(totals.subtotal).toBe(50);
    expect(totals.compareSubtotal).toBe(70);
    expect(totals.savings).toBe(20);
    expect(totals.financing).toBe(12.5);
    expect(totals.shipping).toBe(0);
  });

  it("returns all zeros for an empty array", () => {
    const totals = getBundleTotals([]);
    expect(totals.subtotal).toBe(0);
    expect(totals.compareSubtotal).toBe(0);
    expect(totals.savings).toBe(0);
    expect(totals.financing).toBe(0);
    expect(totals.shipping).toBe(0);
  });

  it("falls back to lineTotal in compareSubtotal when compareLineTotal is null", () => {
    const resolved: ResolvedBundleLine[] = [
      {
        line: makeLine({ quantity: 3 }),
        product: makeProduct(),
        variant: makeVariant({ price: 15, compareAtPrice: null }),
        lineTotal: 45,
        compareLineTotal: null,
      },
    ];
    const totals = getBundleTotals(resolved);
    expect(totals.subtotal).toBe(45);
    expect(totals.compareSubtotal).toBe(45);
    expect(totals.savings).toBe(0);
    expect(totals.financing).toBe(11.25);
  });
});

describe("hasSelectedLines", () => {
  it("returns true when lines are present", () => {
    const state = makeState({ lines: [makeLine()] });
    expect(hasSelectedLines(state)).toBe(true);
  });

  it("returns false when the lines array is empty", () => {
    const state = makeState();
    expect(hasSelectedLines(state)).toBe(false);
  });
});

describe("isProductSelected", () => {
  it("returns true when the product has at least one line", () => {
    const state = makeState({
      lines: [makeLine({ productId: "prod-x" })],
    });
    expect(isProductSelected(state, "prod-x")).toBe(true);
  });

  it("returns false when the product has no lines", () => {
    const state = makeState();
    expect(isProductSelected(state, "prod-x")).toBe(false);
  });
});
