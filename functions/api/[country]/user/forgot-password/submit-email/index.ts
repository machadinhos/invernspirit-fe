import { beClientProxyWithCaptcha } from '@utils';
import { Env } from '@types';

export const onRequest: PagesFunction<Env> = ({ request, env }) => {
  return beClientProxyWithCaptcha(request, ['POST'], env);
};
