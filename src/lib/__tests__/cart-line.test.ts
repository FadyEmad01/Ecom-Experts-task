import type {
  BundleLine,
  ProductId,
  VariantId,
} from "@/features/bundle/bundle.types";
import {
  findCartLine,
  getCartLineId,
  isSameCartLine,
  removeCartLine,
  upsertCartLine,
} from "../cart-line";

const makeLine = (
  id: string,
  productId: ProductId,
  variantId: VariantId | null,
  quantity = 1,
): BundleLine => ({ id, productId, variantId, quantity });

describe("getCartLineId", () => {
  it("returns productId:variantId format", () => {
    expect(getCartLineId("cam-v4", "cam-v4-white")).toBe("cam-v4:cam-v4-white");
  });

  it("works with typical Wyze IDs", () => {
    expect(getCartLineId("wyze-cam-v4", "wyze-cam-v4-white")).toBe(
      "wyze-cam-v4:wyze-cam-v4-white",
    );
  });

  it("works with empty strings", () => {
    expect(getCartLineId("", "")).toBe(":");
  });
});

describe("isSameCartLine", () => {
  const line = makeLine("1", "cam-v4", "cam-v4-white", 2);

  it("returns true when productId AND variantId match", () => {
    expect(isSameCartLine(line, "cam-v4", "cam-v4-white")).toBe(true);
  });

  it("returns false when productId matches but variantId differs", () => {
    expect(isSameCartLine(line, "cam-v4", "cam-v4-black")).toBe(false);
  });

  it("returns false when productId differs but variantId matches", () => {
    expect(isSameCartLine(line, "cam-pan", "cam-v4-white")).toBe(false);
  });

  it("returns false when both differ", () => {
    expect(isSameCartLine(line, "cam-pan", "cam-pan-black")).toBe(false);
  });

  it("returns true when both line.variantId and parameter are null", () => {
    const nullLine = makeLine("2", "hub", null, 1);
    expect(isSameCartLine(nullLine, "hub", null as unknown as VariantId)).toBe(
      true,
    );
  });

  it("returns false when line.variantId is null but parameter is not", () => {
    const nullLine = makeLine("2", "hub", null, 1);
    expect(isSameCartLine(nullLine, "hub", "hub-white")).toBe(false);
  });
});

describe("findCartLine", () => {
  const lines: BundleLine[] = [
    makeLine("1", "cam-v4", "cam-v4-white", 2),
    makeLine("2", "cam-pan", "cam-pan-black", 1),
    makeLine("3", "hub", "hub-white", 3),
  ];

  it("returns the matching line", () => {
    expect(findCartLine(lines, "cam-pan", "cam-pan-black")).toBe(lines[1]);
  });

  it("returns undefined when no match exists", () => {
    expect(findCartLine(lines, "cam-v4", "cam-v4-black")).toBeUndefined();
  });

  it("returns undefined for empty array", () => {
    expect(findCartLine([], "cam-v4", "cam-v4-white")).toBeUndefined();
  });

  it("returns the first match when duplicates exist", () => {
    const dupes: BundleLine[] = [
      makeLine("a", "cam-v4", "cam-v4-white", 1),
      makeLine("b", "cam-v4", "cam-v4-white", 2),
    ];
    expect(findCartLine(dupes, "cam-v4", "cam-v4-white")).toBe(dupes[0]);
  });

  it("finds a line with null variantId", () => {
    const withNull = [...lines, makeLine("4", "relay", null, 1)];
    expect(findCartLine(withNull, "relay", null as unknown as VariantId)).toBe(
      withNull[3],
    );
  });
});

describe("removeCartLine", () => {
  const lines: BundleLine[] = [
    makeLine("1", "cam-v4", "cam-v4-white", 2),
    makeLine("2", "cam-pan", "cam-pan-black", 1),
    makeLine("3", "hub", "hub-white", 3),
  ];

  it("removes the matching line and keeps others", () => {
    const result = removeCartLine(lines, "cam-pan", "cam-pan-black");
    expect(result).toHaveLength(2);
    expect(result).toEqual([lines[0], lines[2]]);
  });

  it("returns a new array with same length when no match", () => {
    const result = removeCartLine(lines, "cam-v4", "cam-v4-black");
    expect(result).toHaveLength(3);
    expect(result).not.toBe(lines);
  });

  it("removes all matching lines when duplicates exist", () => {
    const dupes: BundleLine[] = [
      makeLine("a", "cam-v4", "cam-v4-white", 1),
      makeLine("b", "cam-v4", "cam-v4-white", 2),
    ];
    const result = removeCartLine(dupes, "cam-v4", "cam-v4-white");
    expect(result).toHaveLength(0);
  });

  it("returns empty array when input is empty", () => {
    expect(removeCartLine([], "cam-v4", "cam-v4-white")).toEqual([]);
  });

  it("removes a line with null variantId", () => {
    const withNull = [...lines, makeLine("4", "relay", null, 1)];
    const result = removeCartLine(
      withNull,
      "relay",
      null as unknown as VariantId,
    );
    expect(result).toHaveLength(3);
    expect(result.find((l) => l.id === "4")).toBeUndefined();
  });
});

describe("upsertCartLine", () => {
  it("appends when no existing match", () => {
    const lines: BundleLine[] = [makeLine("1", "cam-v4", "cam-v4-white", 1)];
    const next = makeLine("2", "cam-pan", "cam-pan-black", 1);
    const result = upsertCartLine(lines, next);

    expect(result).toHaveLength(2);
    expect(result[1]).toBe(next);
  });

  it("replaces in-place at the same index on update", () => {
    const lines: BundleLine[] = [
      makeLine("1", "cam-v4", "cam-v4-white", 1),
      makeLine("2", "cam-pan", "cam-pan-black", 1),
    ];
    const updated = makeLine("1", "cam-v4", "cam-v4-white", 5);
    const result = upsertCartLine(lines, updated);

    expect(result).toHaveLength(2);
    expect(result[0]).toBe(updated);
    expect(result[0].quantity).toBe(5);
  });

  it("preserves order of other lines", () => {
    const lines: BundleLine[] = [
      makeLine("1", "cam-v4", "cam-v4-white", 1),
      makeLine("2", "cam-pan", "cam-pan-black", 1),
      makeLine("3", "hub", "hub-white", 1),
    ];
    const updated = makeLine("2", "cam-pan", "cam-pan-black", 99);
    const result = upsertCartLine(lines, updated);

    expect(result[0]).toBe(lines[0]);
    expect(result[1]).toBe(updated);
    expect(result[2]).toBe(lines[2]);
  });

  it("does not mutate the original array", () => {
    const lines: BundleLine[] = [makeLine("1", "cam-v4", "cam-v4-white", 1)];
    const updated = makeLine("1", "cam-v4", "cam-v4-white", 10);
    upsertCartLine(lines, updated);

    expect(lines[0].quantity).toBe(1);
  });

  it("inserts a line with null variantId when no match", () => {
    const lines: BundleLine[] = [makeLine("1", "cam-v4", "cam-v4-white", 1)];
    const next = makeLine("2", "relay", null, 2);
    const result = upsertCartLine(lines, next);

    expect(result).toHaveLength(2);
    expect(result[1].variantId).toBeNull();
  });

  it("updates a line with null variantId when matched", () => {
    const lines: BundleLine[] = [
      makeLine("1", "cam-v4", "cam-v4-white", 1),
      makeLine("2", "relay", null, 1),
    ];
    const updated = makeLine("2", "relay", null, 7);
    const result = upsertCartLine(lines, updated);

    expect(result).toHaveLength(2);
    expect(result[1]).toBe(updated);
    expect(result[1].quantity).toBe(7);
  });
});
