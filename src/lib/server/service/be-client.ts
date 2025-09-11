import { BE_HOST, BE_ID_KEY, BE_ID_VALUE, BE_SECRET_KEY, BE_SECRET_VALUE } from '$env/static/private';
import { getAllCollections, getCollectionById } from '$lib/service/endpoints/collections';
import { getAllProducts, getProductById } from '$lib/service/endpoints/products';
import { createClientProxy } from '$lib/service/utils';
import { getCountries } from '$lib/service/endpoints/countries';
import { PUBLIC_FE_HOST } from '$env/static/public';
import type { RequestHostContext } from '$lib/service/client/client';

const headers = {
  [BE_ID_KEY]: BE_ID_VALUE,
  [BE_SECRET_KEY]: BE_SECRET_VALUE,
  Referer: PUBLIC_FE_HOST,
};

const context: RequestHostContext = {
  headers,
  host: BE_HOST,
};

const beClientRoutes = {
  collections: {
    getAll: getAllCollections,
    getById: getCollectionById,
  },
  products: {
    getAll: getAllProducts,
    getById: getProductById,
  },
  countries: { getAll: getCountries },
};

export const beClient = createClientProxy(beClientRoutes, context);
