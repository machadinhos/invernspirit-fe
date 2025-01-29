import { beClient } from '$service-server';
import type { Country } from '$types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
  const countries = await beClient.countries.getAll();
  return {
    country: countries.find((country) => country.code === params.country.toUpperCase()) as Country,
    countries,
  };
};
