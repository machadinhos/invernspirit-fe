import { Client, type RequestHostContext } from '../client';
import type { Country } from '$types';

const PATH = '';

let cachedCountries: Country[];

export const prepareGetCountries = (context: RequestHostContext) => {
  return async (): Promise<Country[]> => {
    if (!cachedCountries) {
      cachedCountries = await Client.create<Country[]>()
        .withHostContext(context)
        .withEndpoint(`/${PATH}`)
        .withMethod('GET')
        .call();
    }
    return cachedCountries;
  };
};
