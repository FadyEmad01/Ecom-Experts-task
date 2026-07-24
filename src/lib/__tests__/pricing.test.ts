import {
  getCompareLineTotal,
  getFinancingAmount,
  getLineTotal,
  getSavingsAmount,
  hasSavings,
  roundMoney,
} from "../pricing";

describe("roundMoney", () => {
  it("rounds down when third decimal is below 5", () => {
    expect(roundMoney(27.984)).toBe(27.98);
  });

  it("rounds up when third decimal is 5 or above", () => {
    expect(roundMoney(27.985)).toBe(27.99);
  });

  it("rounds up values like 27.981 due to EPSILON bias", () => {
    expect(roundMoney(27.981)).toBe(27.98);
  });

  it("rounds up 27.9801 to 27.98 via EPSILON", () => {
    expect(roundMoney(27.9801)).toBe(27.98);
  });

  it("returns 0 for zero", () => {
    expect(roundMoney(0)).toBe(0);
  });

  it("returns the same value when already rounded", () => {
    expect(roundMoney(19.99)).toBe(19.99);
  });

  it("handles large numbers", () => {
    expect(roundMoney(999999.999)).toBe(1000000);
  });

  it("handles negative amounts", () => {
    expect(roundMoney(-5.678)).toBe(-5.68);
  });

  it("handles small fractional amounts below EPSILON threshold", () => {
    expect(roundMoney(0.001)).toBe(0);
  });
});

describe("getLineTotal", () => {
  it("returns unitPrice multiplied by quantity", () => {
    expect(getLineTotal(10.99, 3)).toBe(32.97);
  });

  it("returns 0 when quantity is zero", () => {
    expect(getLineTotal(10.99, 0)).toBe(0);
  });

  it("returns 0 when unitPrice is zero", () => {
    expect(getLineTotal(0, 5)).toBe(0);
  });

  it("handles floating point precision (0.1 × 3)", () => {
    expect(getLineTotal(0.1, 3)).toBe(0.3);
  });

  it("handles large numbers", () => {
    expect(getLineTotal(999999.99, 100)).toBe(99999999);
  });

  it("rounds the result to two decimals", () => {
    expect(getLineTotal(1.01, 3)).toBe(3.03);
  });
});

describe("getCompareLineTotal", () => {
  it("uses compareAtPrice when provided", () => {
    expect(getCompareLineTotal(10, 15, 3)).toBe(45);
  });

  it("falls back to unitPrice when compareAtPrice is null", () => {
    expect(getCompareLineTotal(10, null, 3)).toBe(30);
  });

  it("returns 0 when quantity is zero", () => {
    expect(getCompareLineTotal(10, 15, 0)).toBe(0);
  });

  it("handles large numbers", () => {
    expect(getCompareLineTotal(500, 999.99, 1000)).toBe(999990);
  });

  it("rounds the result to two decimals", () => {
    expect(getCompareLineTotal(10, 1.01, 3)).toBe(3.03);
  });
});

describe("getSavingsAmount", () => {
  it("returns positive savings when compareTotal exceeds currentTotal", () => {
    expect(getSavingsAmount(100, 75)).toBe(25);
  });

  it("returns 0 when totals are equal", () => {
    expect(getSavingsAmount(50, 50)).toBe(0);
  });

  it("returns a negative value when currentTotal exceeds compareTotal", () => {
    expect(getSavingsAmount(30, 50)).toBe(-20);
  });

  it("rounds the result to two decimals", () => {
    expect(getSavingsAmount(10.01, 5)).toBe(5.01);
  });
});

describe("hasSavings", () => {
  it("returns true when compareAtPrice is greater than currentPrice", () => {
    expect(hasSavings(20, 15)).toBe(true);
  });

  it("returns false when compareAtPrice equals currentPrice", () => {
    expect(hasSavings(15, 15)).toBe(false);
  });

  it("returns false when compareAtPrice is less than currentPrice", () => {
    expect(hasSavings(10, 15)).toBe(false);
  });

  it("returns false when compareAtPrice is null", () => {
    expect(hasSavings(null, 15)).toBe(false);
  });
});

describe("getFinancingAmount", () => {
  it("divides total by 4 installments by default", () => {
    expect(getFinancingAmount(100)).toBe(25);
  });

  it("divides total by a custom installment count", () => {
    expect(getFinancingAmount(100, 5)).toBe(20);
  });

  it("returns 0 when total is zero", () => {
    expect(getFinancingAmount(0)).toBe(0);
  });

  it("rounds the result to two decimals", () => {
    expect(getFinancingAmount(100, 3)).toBe(33.33);
  });

  it("handles floating point precision", () => {
    expect(getFinancingAmount(0.3, 3)).toBe(0.1);
  });

  it("handles large totals", () => {
    expect(getFinancingAmount(999999.96, 4)).toBe(249999.99);
  });
});
