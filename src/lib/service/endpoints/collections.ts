import type { Collection, CollectionDetails } from '$types';
import { Client } from '../client';
import type { Endpoint } from './endpoint';

const PATH = 'collections';

export const prepareGetAllCollections: Endpoint<Collection[]> = (context) => {
  return (countryCode) => {
    return Client.create<Collection[]>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}`)
      .withMethod('GET')
      .call();
  };
};

export const prepareGetCollectionById: Endpoint<CollectionDetails, [string]> = (context) => {
  return (countryCode, id) => {
    return Client.create<CollectionDetails>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/${id}`)
      .withMethod('GET')
      .call();
  };
};
