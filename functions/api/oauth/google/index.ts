import { beClientProxy } from '@utils';
import { Env } from '@types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const state = JSON.parse(url.searchParams.get('state') ?? '{}');

  if (!state.country) return new Response('No country provided in state', { status: 400 });

  const bePath = `/${state.country}/oauth/google/callback${url.search}`;

  const beResponse = await beClientProxy(context, { bePath });

  if (!beResponse.ok) return beResponse;

  const feUrl = state.url ? new URL(state.url) : new URL(`${env.FE_HOST}/${state.country}`);

  if (state.action) {
    feUrl.searchParams.set('action', state.action);
  }

  beResponse.headers.set('Location', feUrl.toString());

  return new Response(beResponse.body, {
    status: 302,
    headers: beResponse.headers,
  });
};
