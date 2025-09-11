import { Client } from '../client';
import type { Endpoint } from './endpoint';
import type { Product } from '$types';

const PATH = 'products';

export const getAllProducts: Endpoint<Product[]> = (context, countryCode) => {
  return Client.create<Product[]>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}`)
    .withMethod('GET')
    .call();
};

export const getProductById: Endpoint<Product, [string]> = (context, countryCode, id: string) => {
  return Client.create<Product>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/${id}`)
    .withMethod('GET')
    .call();
};

export const getProductsBySearch: Endpoint<Product[], [string]> = (context, countryCode, search) => {
  return Client.create<Product[]>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}`)
    .withMethod('GET')
    .withSearchParams({ search })
    .call();
};
