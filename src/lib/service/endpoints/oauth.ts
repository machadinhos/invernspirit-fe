import type { Cart, UserDetails } from '$types';
import { Client } from '$lib/service/client';
import type { Endpoint } from './endpoint';

const PATH = 'oauth';

type OauthGoogleGetRedirectResponse = {
  url: string;
};

export const prepareOauthGoogleGetRedirect: Endpoint<OauthGoogleGetRedirectResponse> = (context) => {
  return (countryCode) => {
    return Client.create<OauthGoogleGetRedirectResponse>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/google/redirect`)
      .withMethod('GET')
      .call();
  };
};

type OauthGoogleCallbackResponse = {
  user: UserDetails;
  cart: Cart;
  newUser: boolean;
};

export const prepareOauthGoogleCallback: Endpoint<OauthGoogleCallbackResponse, [URL]> = (context) => {
  return (countryCode, redirectUrl) => {
    return Client.create<OauthGoogleCallbackResponse>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/google/callback${redirectUrl.search}`)
      .withMethod('GET')
      .call();
  };
};
