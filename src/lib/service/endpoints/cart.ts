import type { Cart } from '$types';
import { Client } from '../client';
import type { Endpoint } from './endpoint';

const PATH = 'cart';

export const getCart: Endpoint<Cart> = (context, countryCode) => {
  return Client.create<Cart>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}`)
    .withMethod('GET')
    .call();
};

type UpdateCartItemBody = {
  quantity: number;
};

export const updateCartItemQuantity: Endpoint<Cart, [string, number]> = (
  context,
  countryCode,
  productId,
  productQuantity,
) => {
  return Client.create<Cart, UpdateCartItemBody>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/items/${productId}`)
    .withMethod('PUT')
    .withBody({ quantity: productQuantity })
    .call();
};

export const removeCartItem: Endpoint<Cart, [string]> = (context, countryCode, productId) => {
  return Client.create<Cart>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/items/${productId}`)
    .withMethod('DELETE')
    .call();
};
