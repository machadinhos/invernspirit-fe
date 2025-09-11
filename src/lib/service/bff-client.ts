import {
  deleteLoggedInUser,
  forgotPasswordResetPassword,
  forgotPasswordSubmitEmail,
  forgotPasswordValidateCode,
  getLoggedInUser,
  login,
  logout,
  resendEmail,
  signUp,
  updateLoggedInUserEmailSubmitEmail,
  updateLoggedInUserEmailValidateCode,
  updateLoggedInUserPassword,
  updateLoggedInUserPersonalInformation,
  verifyEmail,
} from './endpoints/user';
import {
  getAddress,
  getPayment,
  getPersonalDetails,
  getReview,
  getShippingMethods,
  getStages,
  setAddress,
  setPersonalDetails,
  setShippingMethod,
} from './endpoints/checkout';
import { getAllOrders, getOrderById } from './endpoints/orders';
import { getCart, removeCartItem, updateCartItemQuantity } from './endpoints/cart';
import { oauthGoogleCallback, oauthGoogleGetRedirect } from '$lib/service/endpoints/oauth';
import { config } from '$lib/service/endpoints/config';
import { createClientProxy } from '$lib/service/utils';
import { getProductsBySearch } from '$lib/service/endpoints/products';
import { PUBLIC_BFF_HOST } from '$env/static/public';
import type { RequestHostContext } from './client';

const context: RequestHostContext = {
  host: PUBLIC_BFF_HOST,
};

const bffClientRoutes = {
  checkout: {
    stages: {
      get: getStages,
      personalDetails: {
        get: getPersonalDetails,
        set: setPersonalDetails,
      },
      address: {
        get: getAddress,
        set: setAddress,
      },
      shipping: {
        get: getShippingMethods,
        set: setShippingMethod,
      },
      payment: {
        get: getPayment,
      },
      review: {
        get: getReview,
      },
    },
  },
  config: { get: config },
  cart: {
    get: getCart,
    updateItemQuantity: updateCartItemQuantity,
    removeItem: removeCartItem,
  },
  order: {
    getById: getOrderById,
    getAll: getAllOrders,
  },
  products: { getBySearch: getProductsBySearch },
  user: {
    oauth: {
      google: {
        getRedirectUrl: oauthGoogleGetRedirect,
        callback: oauthGoogleCallback,
      },
    },
    get: getLoggedInUser,
    update: {
      personalInformation: updateLoggedInUserPersonalInformation,
      password: updateLoggedInUserPassword,
      email: {
        submitEmail: updateLoggedInUserEmailSubmitEmail,
        validateCode: updateLoggedInUserEmailValidateCode,
      },
    },
    delete: deleteLoggedInUser,
    signUp: {
      create: signUp,
      verifyEmail: verifyEmail,
      resendEmail: resendEmail,
    },
    login: login,
    logout: logout,
    forgotPassword: {
      submitEmail: forgotPasswordSubmitEmail,
      validCode: forgotPasswordValidateCode,
      resetPassword: forgotPasswordResetPassword,
    },
  },
};

export const bffClient = createClientProxy(bffClientRoutes, context);
