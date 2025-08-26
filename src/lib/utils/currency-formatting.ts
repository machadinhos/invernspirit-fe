const currencyFormatters = new Map<string, Intl.NumberFormat>();

const getCurrencyFormatter = (locale: string, currencyCode: string): Intl.NumberFormat => {
  const key = `${locale}-${currencyCode}`;
  if (!currencyFormatters.has(key)) currencyFormatters.set(key, createFormatter(locale, currencyCode));
  return currencyFormatters.get(key) ?? createFormatter(locale, currencyCode);
};

const createFormatter = (locale: string, currencyCode: string): Intl.NumberFormat => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode });
};

export const formatPrice = (locale: string, currencyCode: string, priceInCents: number): string => {
  const priceInBaseUnit = priceInCents / 100;
  return getCurrencyFormatter(locale, currencyCode).format(priceInBaseUnit);
};
