import { BE_HOST, BE_ID_KEY, BE_ID_VALUE, BE_SECRET_KEY, BE_SECRET_VALUE } from '$env/static/private';
import { prepareGetAllCollections, prepareGetCollectionById } from '$lib/service/endpoints/collections';
import { prepareGetAllProducts, prepareGetProductById } from '$lib/service/endpoints/products';
import { prepareGetCountries } from '$lib/service/endpoints/countries';
import type { RequestHostContext } from '$lib/service/client/client';

const headers = {
  [BE_ID_KEY]: BE_ID_VALUE,
  [BE_SECRET_KEY]: BE_SECRET_VALUE,
};

const context: RequestHostContext = {
  headers,
  host: BE_HOST,
};

export const beClient = {
  collections: {
    getAll: prepareGetAllCollections(context),
    getById: prepareGetCollectionById(context),
  },
  products: {
    getAll: prepareGetAllProducts(context),
    getById: prepareGetProductById(context),
  },
  countries: { getAll: prepareGetCountries(context) },
};
