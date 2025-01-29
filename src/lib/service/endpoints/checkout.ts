import type { Address, CheckoutStage, Review, ShippingMethod, User } from '$types';
import { Client } from '../client';
import type { Endpoint } from './endpoint';

const PATH = 'checkout/stages';

type BaseCheckoutResponse = {
  availableCheckoutStages: CheckoutStage[];
};

type CheckoutStagesResponse = {
  isCheckoutPossible?: boolean;
} & BaseCheckoutResponse;

export const prepareGetStages: Endpoint<CheckoutStagesResponse> = (context) => {
  return (countryCode) => {
    return Client.create<CheckoutStagesResponse>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}`)
      .withMethod('GET')
      .call();
  };
};

type PersonalDetailsResponse = {
  personalDetails?: User;
} & BaseCheckoutResponse;

export const prepareGetPersonalDetails: Endpoint<PersonalDetailsResponse> = (context) => {
  return (countryCode) => {
    return Client.create<PersonalDetailsResponse>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/personal-details`)
      .withMethod('GET')
      .call();
  };
};

type PersonalDetailsPayload = {
  personalDetails: User;
  savePersonalDetails?: boolean;
};

export const prepareSetPersonalDetails: Endpoint<BaseCheckoutResponse, [PersonalDetailsPayload]> = (context) => {
  return (countryCode, personalDetails) => {
    return Client.create<BaseCheckoutResponse, PersonalDetailsPayload>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/personal-details`)
      .withMethod('POST')
      .withBody(personalDetails)
      .call();
  };
};

type AddressResponse = {
  address?: Address;
} & BaseCheckoutResponse;

export const prepareGetAddress: Endpoint<AddressResponse> = (context) => {
  return (countryCode) => {
    return Client.create<AddressResponse>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/address`)
      .withMethod('GET')
      .call();
  };
};

type AddressPayload = {
  address: Address;
  saveAddress?: boolean;
};

export const prepareSetAddress: Endpoint<BaseCheckoutResponse, [AddressPayload]> = (context) => {
  return (countryCode, address) => {
    return Client.create<BaseCheckoutResponse, AddressPayload>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/address`)
      .withMethod('POST')
      .withBody(address)
      .call();
  };
};

type ShippingMethodsResponse = {
  shippingMethods: ShippingMethod[];
  selectedShippingMethod: ShippingMethod;
} & BaseCheckoutResponse;

export const prepareGetShippingMethods: Endpoint<ShippingMethodsResponse> = (context) => {
  return (countryCode) => {
    return Client.create<ShippingMethodsResponse>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/shipping`)
      .withMethod('GET')
      .call();
  };
};

export const prepareSetShippingMethod: Endpoint<BaseCheckoutResponse, [string]> = (context) => {
  return (countryCode, id) => {
    return Client.create<BaseCheckoutResponse, { id: string }>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/shipping`)
      .withMethod('POST')
      .withBody({ id })
      .call();
  };
};

export const prepareGetReview: Endpoint<Review> = (context) => {
  return (countryCode) => {
    return Client.create<Review>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/review`)
      .withMethod('GET')
      .call();
  };
};

type PaymentResponse = {
  url: string;
};

export const prepareGetPayment: Endpoint<PaymentResponse> = (context) => {
  return (countryCode) => {
    return Client.create<PaymentResponse>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/payment`)
      .withMethod('GET')
      .call();
  };
};
