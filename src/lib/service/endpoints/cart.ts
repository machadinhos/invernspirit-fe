import type { Cart } from '$types';
import { Client } from '../client';
import type { Endpoint } from './endpoint';

const PATH = 'cart';

export const prepareGetCart: Endpoint<Cart> = (context) => {
  return (countryCode) => {
    return Client.create<Cart>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}`)
      .withMethod('GET')
      .call();
  };
};

type UpdateCartItemBody = {
  quantity: number;
};

export const prepareUpdateCartItem: Endpoint<Cart, [string, number]> = (context) => {
  return (countryCode, productId, productQuantity) => {
    return Client.create<Cart, UpdateCartItemBody>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/items/${productId}`)
      .withMethod('PUT')
      .withBody({ quantity: productQuantity })
      .call();
  };
};

export const prepareRemoveCartItem: Endpoint<Cart, [string]> = (context) => {
  return (countryCode, productId) => {
    return Client.create<Cart>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/items/${productId}`)
      .withMethod('DELETE')
      .call();
  };
};
