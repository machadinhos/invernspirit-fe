import { Client, type RetriesConfig } from '../client';
import type { Endpoint } from './endpoint';
import type { Order } from '$types';

const PATH = 'orders';

type OrderResponse = {
  order: Order;
};

export const prepareGetOrderById: Endpoint<OrderResponse, [string, RetriesConfig | undefined]> = (context) => {
  return (countryCode, id, retriesConfig) => {
    return Client.create<OrderResponse>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/${id}`)
      .withMethod('GET')
      .withRetries(retriesConfig)
      .call();
  };
};
