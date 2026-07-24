type FormatMoneyOptions = {
  currency: string;
  locale: string;
  freeLabel?: string;
  suffix?: string;
};

export const formatMoney = (
  amount: number,
  options: FormatMoneyOptions,
): string => {
  const { currency, locale, freeLabel, suffix = "" } = options;

  if (amount === 0 && freeLabel) {
    return freeLabel;
  }

  const formattedAmount = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${formattedAmount}${suffix}`;
};
