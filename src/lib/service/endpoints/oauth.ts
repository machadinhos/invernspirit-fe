import { Client } from '$lib/service/client';
import type { Endpoint } from '$lib/service/endpoints/endpoint';

const PATH = 'oauth';

type OauthGoogleResponse = {
  url: string;
};

export const prepareOauthGoogle: Endpoint<OauthGoogleResponse> = (context) => {
  return (countryCode) => {
    return Client.create<OauthGoogleResponse>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/google/redirect`)
      .withMethod('GET')
      .call();
  };
};
