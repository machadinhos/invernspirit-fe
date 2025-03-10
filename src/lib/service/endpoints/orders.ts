import { Client, type RetriesConfig } from '../client';
import type { Endpoint } from './endpoint';
import type { Order } from '$types';

const PATH = 'orders';

type OrderResponse = {
  order: Order;
};

type OrderHeaders = {
  'x-user-email': string;
};

type OrderConfig = {
  retriesConfig?: RetriesConfig;
  headers?: OrderHeaders;
  shouldPushIssuesToToasts?: boolean;
};

export const prepareGetOrderById: Endpoint<OrderResponse, [string, OrderConfig] | [string]> = (context) => {
  return (countryCode, id, { shouldPushIssuesToToasts = true, retriesConfig, headers } = {}) => {
    return Client.create<OrderResponse>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/${id}`)
      .withMethod('GET')
      .withRetries(retriesConfig)
      .withHeaders(headers)
      .call(shouldPushIssuesToToasts);
  };
};
