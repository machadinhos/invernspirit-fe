import { Client } from '../client';
import type { Config } from '$types';
import type { Endpoint } from './endpoint';

const PATH = 'config';

export const prepareConfig: Endpoint<Config, [Record<string, string>]> = (context) => {
  return (countryCode, headers) => {
    return Client.create<Config>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}`)
      .withMethod('GET')
      .withHeaders(headers)
      .call();
  };
};
