const currencyFormater = new Map<string, Intl.NumberFormat>();

const getCurrencyFormater = (locale: string, currencyCode: string): Intl.NumberFormat => {
  const key = `${locale}-${currencyCode}`;
  if (!currencyFormater.has(key)) currencyFormater.set(key, createFormater(locale, currencyCode));
  return currencyFormater.get(`${locale}-${currencyCode}`) ?? createFormater(locale, currencyCode);
};

const createFormater = (locale: string, currencyCode: string): Intl.NumberFormat => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode });
};

export const formatPrice = (locale: string, currencyCode: string, priceInCents: number): string => {
  const priceInBaseUnit = priceInCents / 100;
  return getCurrencyFormater(locale, currencyCode).format(priceInBaseUnit);
};
