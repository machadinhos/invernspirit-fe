import { beClientProxy } from '@utils';
import { Env } from '@types';

export const onRequest: PagesFunction<Env> = ({ request, env }) => {
  return beClientProxy(request, ['PUT', 'PATCH', 'DELETE'], env);
};
