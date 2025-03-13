import { beClientProxy } from '@utils';
import { Env } from '@types';

export const onRequest: PagesFunction<Env> = ({ request, env }) => {
  const url = new URL(request.url);
  if (!url.searchParams.has('search')) return new Response('No search provided', { status: 400 });
  return beClientProxy(request, ['GET'], env);
};
