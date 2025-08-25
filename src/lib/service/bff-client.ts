import {
  prepareDeleteLoggedInUser,
  prepareForgotPasswordResetPassword,
  prepareForgotPasswordSubmitEmail,
  prepareForgotPasswordValidateCode,
  prepareGetLoggedInUser,
  prepareLogin,
  prepareLogout,
  prepareResendEmail,
  prepareSignUp,
  prepareUpdateLoggedInUserEmailSubmitEmail,
  prepareUpdateLoggedInUserEmailValidateCode,
  prepareUpdateLoggedInUserPassword,
  prepareUpdateLoggedInUserPersonalInformation,
  prepareVerifyEmail,
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
import { prepareGetAllOrders, prepareGetOrderById } from './endpoints/orders';
import { prepareGetCart, prepareRemoveCartItem, prepareUpdateCartItemQuantity } from './endpoints/cart';
import { prepareOauthGoogleCallback, prepareOauthGoogleGetRedirect } from '$lib/service/endpoints/oauth';
import { prepareConfig } from '$lib/service/endpoints/config';
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
    updateItemQuantity: prepareUpdateCartItemQuantity(context),
    removeItem: prepareRemoveCartItem(context),
  },
  order: {
    getById: prepareGetOrderById(context),
    getAll: prepareGetAllOrders(context),
  },
  products: { getBySearch: prepareGetProductsBySearch(context) },
  user: {
    oauth: {
      google: {
        getRedirectUrl: prepareOauthGoogleGetRedirect(context),
        callback: prepareOauthGoogleCallback(context),
      },
    },
    get: prepareGetLoggedInUser(context),
    update: {
      personalInformation: prepareUpdateLoggedInUserPersonalInformation(context),
      password: prepareUpdateLoggedInUserPassword(context),
      email: {
        submitEmail: prepareUpdateLoggedInUserEmailSubmitEmail(context),
        validateCode: prepareUpdateLoggedInUserEmailValidateCode(context),
      },
    },
    delete: prepareDeleteLoggedInUser(context),
    signUp: {
      create: prepareSignUp(context),
      verifyEmail: prepareVerifyEmail(context),
      resendEmail: prepareResendEmail(context),
    },
    login: prepareLogin(context),
    logout: prepareLogout(context),
    forgotPassword: {
      submitEmail: prepareForgotPasswordSubmitEmail(context),
      validCode: prepareForgotPasswordValidateCode(context),
      resetPassword: prepareForgotPasswordResetPassword(context),
    },
  },
};
