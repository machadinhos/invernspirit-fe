import { beClient } from '$service-server';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = async () => {
  return (await beClient.countries.getAll()).map((countryObject) => {
    return { country: countryObject.code.toLowerCase() };
  });
};
