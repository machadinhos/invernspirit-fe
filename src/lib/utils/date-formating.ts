import type { Country } from '$types';

export const formatDate = (country: Country, isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleString(country.locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
