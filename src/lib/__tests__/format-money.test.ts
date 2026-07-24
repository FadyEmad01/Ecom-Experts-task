import { formatMoney } from "@/lib/format-money";

const usd = (overrides?: Partial<Parameters<typeof formatMoney>[1]>) => ({
  currency: "USD",
  locale: "en-US",
  ...overrides,
});

describe("formatMoney", () => {
  describe("basic USD formatting", () => {
    it("formats a typical price with two decimals", () => {
      expect(formatMoney(27.98, usd())).toBe("$27.98");
    });

    it("formats zero as $0.00 when no freeLabel", () => {
      expect(formatMoney(0, usd())).toBe("$0.00");
    });

    it("pads whole numbers to two decimal places", () => {
      expect(formatMoney(100, usd())).toBe("$100.00");
    });

    it("formats negative amounts", () => {
      expect(formatMoney(-10.5, usd())).toBe("-$10.50");
    });
  });

  describe("freeLabel behavior", () => {
    it("returns freeLabel when amount is zero and freeLabel is provided", () => {
      expect(formatMoney(0, usd({ freeLabel: "Free" }))).toBe("Free");
    });

    it("returns $0.00 when amount is zero and freeLabel is omitted", () => {
      expect(formatMoney(0, usd())).toBe("$0.00");
    });

    it("returns $0.00 when freeLabel is an empty string", () => {
      expect(formatMoney(0, usd({ freeLabel: "" }))).toBe("$0.00");
    });

    it("ignores freeLabel when amount is non-zero", () => {
      expect(formatMoney(5, usd({ freeLabel: "Free" }))).toBe("$5.00");
    });
  });

  describe("suffix behavior", () => {
    it("appends suffix to formatted amount", () => {
      expect(formatMoney(27.98, usd({ suffix: "/mo" }))).toBe("$27.98/mo");
    });

    it("defaults suffix to empty string", () => {
      expect(formatMoney(27.98, usd())).toBe("$27.98");
    });

    it("does not append suffix when freeLabel triggers", () => {
      expect(formatMoney(0, usd({ freeLabel: "Free", suffix: "/mo" }))).toBe(
        "Free",
      );
    });
  });

  describe("different currencies and locales", () => {
    it("formats EUR with de-DE locale using comma decimal and trailing symbol", () => {
      const result = formatMoney(27.98, { currency: "EUR", locale: "de-DE" });
      expect(result).toMatch(/27[,.]98/);
      expect(result).toContain("€");
    });

    it("formats GBP with en-GB locale", () => {
      const result = formatMoney(27.98, { currency: "GBP", locale: "en-GB" });
      expect(result).toMatch(/£27\.98/);
    });
  });

  describe("edge cases", () => {
    it("formats the smallest cent value", () => {
      expect(formatMoney(0.01, usd())).toBe("$0.01");
    });

    it("formats large amounts with comma grouping", () => {
      expect(formatMoney(999999.99, usd())).toBe("$999,999.99");
    });

    it("rounds half-up to two decimals via Intl", () => {
      expect(formatMoney(27.985, usd())).toBe("$27.99");
    });
  });
});
