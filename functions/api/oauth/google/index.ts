import { beClientProxy } from '@utils';
import { Env } from '@types';

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const state = JSON.parse(url.searchParams.get('state') ?? '{}');

  if (!state.country) return new Response('No country provided in state', { status: 400 });

  const beUrl = `${env.BE_HOST}/${state.country}/oauth/google/callback${url.search}`;

  const beResponse = await beClientProxy(request, ['GET'], env, { beUrl: beUrl });

  if (!beResponse.ok) return beResponse;

  let feUrl: URL;
  if (state.url) {
    feUrl = new URL(state.url);
  } else {
    feUrl = new URL(`${env.FE_HOST}/${state.country}`);
  }

  if (state.action) {
    feUrl.searchParams.set('action', state.action);
  }

  beResponse.headers.set('Location', feUrl.toString());

  return new Response(beResponse.body, {
    status: 302,
    headers: beResponse.headers,
  });
};
