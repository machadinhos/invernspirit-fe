import { Client } from '../client';
import type { Config } from '$types';
import type { Endpoint } from './endpoint';

const PATH = 'config';

type ConfigHeaders = {
  'after-checkout': string;
};

export const config: Endpoint<Config, [ConfigHeaders | undefined]> = (context, countryCode, headers) => {
  return Client.create<Config>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}`)
    .withMethod('GET')
    .withHeaders(headers)
    .call();
};
