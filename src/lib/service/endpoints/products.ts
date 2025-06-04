import { Client } from '../client';
import type { Endpoint } from './endpoint';
import type { Product } from '$types';

const PATH = 'products';

export const prepareGetAllProducts: Endpoint<Product[]> = (context) => {
  return (countryCode) => {
    return Client.create<Product[]>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}`)
      .withMethod('GET')
      .call();
  };
};

export const prepareGetProductById: Endpoint<Product, [string]> = (context) => {
  return (countryCode, id: string) => {
    return Client.create<Product>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/${id}`)
      .withMethod('GET')
      .call();
  };
};

export const prepareGetProductsBySearch: Endpoint<Product[], [string]> = (context) => {
  return (countryCode, search: string) => {
    return Client.create<Product[]>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}`)
      .withMethod('GET')
      .withSearchParams({ search })
      .call();
  };
};
