const EPSILON = 0.0001;

export const roundMoney = (amount: number): number => {
  return Math.round((amount + EPSILON) * 100) / 100;
};

export const getLineTotal = (unitPrice: number, quantity: number): number => {
  return roundMoney(unitPrice * quantity);
};

export const getCompareLineTotal = (
  unitPrice: number,
  compareAtPrice: number | null,
  quantity: number,
): number => {
  if (compareAtPrice === null) {
    return roundMoney(unitPrice * quantity);
  }
  return roundMoney(compareAtPrice * quantity);
};

export const getSavingsAmount = (
  compareTotal: number,
  currentTotal: number,
): number => {
  return roundMoney(compareTotal - currentTotal);
};

export const hasSavings = (
  compareAtPrice: number | null,
  currentPrice: number,
): boolean => {
  if (compareAtPrice === null) return false;
  return compareAtPrice > currentPrice;
};

export const getFinancingAmount = (
  total: number,
  installmentsCount = 4,
): number => {
  return roundMoney(total / installmentsCount);
};
