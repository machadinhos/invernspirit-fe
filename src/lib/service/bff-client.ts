import {
  prepareDeleteLoggedInUser,
  prepareGetLoggedInUser,
  prepareLogin,
  prepareLogout,
  prepareSignUp,
  prepareUpdateLoggedInUser,
} from './endpoints/user';
import {
  prepareGetAddress,
  prepareGetPayment,
  prepareGetPersonalDetails,
  prepareGetReview,
  prepareGetShippingMethods,
  prepareGetStages,
  prepareSetAddress,
  prepareSetPersonalDetails,
  prepareSetShippingMethod,
} from './endpoints/checkout';
import { prepareGetCart, prepareRemoveCartItem, prepareUpdateCartItem } from './endpoints/cart';
import { prepareConfig } from '$lib/service/endpoints/config';
import { prepareGetOrderById } from './endpoints/orders';
import { prepareGetProductsBySearch } from '$lib/service/endpoints/products';
import { PUBLIC_BFF_HOST } from '$env/static/public';
import type { RequestHostContext } from './client';

const context: RequestHostContext = {
  host: PUBLIC_BFF_HOST,
};

export const bffClient = {
  checkout: {
    stages: {
      get: prepareGetStages(context),
      personalDetails: {
        get: prepareGetPersonalDetails(context),
        set: prepareSetPersonalDetails(context),
      },
      address: {
        get: prepareGetAddress(context),
        set: prepareSetAddress(context),
      },
      shipping: {
        get: prepareGetShippingMethods(context),
        set: prepareSetShippingMethod(context),
      },
      payment: {
        get: prepareGetPayment(context),
      },
      review: {
        get: prepareGetReview(context),
      },
    },
  },
  config: { get: prepareConfig(context) },
  cart: {
    get: prepareGetCart(context),
    updateItem: prepareUpdateCartItem(context),
    removeItem: prepareRemoveCartItem(context),
  },
  order: { getById: prepareGetOrderById(context) },
  products: { getBySearch: prepareGetProductsBySearch(context) },
  user: {
    get: prepareGetLoggedInUser(context),
    update: prepareUpdateLoggedInUser(context),
    delete: prepareDeleteLoggedInUser(context),
    signUp: prepareSignUp(context),
    login: prepareLogin(context),
    logout: prepareLogout(context),
  },
};
