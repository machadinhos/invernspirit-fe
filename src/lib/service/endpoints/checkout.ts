import type { Address, CheckoutStage, ExtendedAddress, Review, ShippingMethod, User } from '$types';
import { Client } from '../client';
import type { Endpoint } from './endpoint';

const PATH = 'checkout/stages';

type BaseCheckoutResponse = {
  availableCheckoutStages: CheckoutStage[];
};

type CheckoutStagesResponse = {
  isCheckoutPossible?: boolean;
} & BaseCheckoutResponse;

export const getStages: Endpoint<CheckoutStagesResponse> = (context, countryCode) => {
  return Client.create<CheckoutStagesResponse>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}`)
    .withMethod('GET')
    .call();
};

type PersonalDetailsResponse = {
  personalDetails?: User;
} & BaseCheckoutResponse;

export const getPersonalDetails: Endpoint<PersonalDetailsResponse> = (context, countryCode) => {
  return Client.create<PersonalDetailsResponse>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/personal-details`)
    .withMethod('GET')
    .call();
};

type PersonalDetailsPayload = {
  personalDetails: User;
  savePersonalDetails?: boolean;
};

export const setPersonalDetails: Endpoint<BaseCheckoutResponse, [PersonalDetailsPayload]> = (
  context,
  countryCode,
  personalDetails,
) => {
  return Client.create<BaseCheckoutResponse, PersonalDetailsPayload>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/personal-details`)
    .withMethod('POST')
    .withBody(personalDetails)
    .call();
};

type AddressResponse = {
  address?: ExtendedAddress & { saveAddress?: boolean };
} & BaseCheckoutResponse;

export const getAddress: Endpoint<AddressResponse> = (context, countryCode) => {
  return Client.create<AddressResponse>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/address`)
    .withMethod('GET')
    .call();
};

type AddressPayload = {
  address: Address;
  saveAddress?: boolean;
};

export const setAddress: Endpoint<BaseCheckoutResponse, [AddressPayload]> = (context, countryCode, address) => {
  return Client.create<BaseCheckoutResponse, AddressPayload>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/address`)
    .withMethod('POST')
    .withBody(address)
    .call();
};

type ShippingMethodsResponse = {
  shippingMethods: ShippingMethod[];
  selectedShippingMethod: ShippingMethod;
} & BaseCheckoutResponse;

export const getShippingMethods: Endpoint<ShippingMethodsResponse> = (context, countryCode) => {
  return Client.create<ShippingMethodsResponse>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/shipping`)
    .withMethod('GET')
    .call();
};

export const setShippingMethod: Endpoint<BaseCheckoutResponse, [string]> = (context, countryCode, id) => {
  return Client.create<BaseCheckoutResponse, { id: string }>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/shipping`)
    .withMethod('POST')
    .withBody({ id })
    .call();
};

export const getReview: Endpoint<Review> = (context, countryCode) => {
  return Client.create<Review>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/review`)
    .withMethod('GET')
    .call();
};

type PaymentResponse = {
  url: string;
};

export const getPayment: Endpoint<PaymentResponse> = (context, countryCode) => {
  return Client.create<PaymentResponse>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/payment`)
    .withMethod('GET')
    .call();
};
