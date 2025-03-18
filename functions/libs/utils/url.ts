import { Env } from '@types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type Config = {
  beUrl?: string;
};

export const beClientProxy = async (
  request: Request,
  allowedMethods: HttpMethod[],
  env: Env,
  config?: Config,
): Promise<Response> => {
  if (!allowedMethods.includes(request.method as HttpMethod)) {
    return new Response('Method not allowed', { status: 405 });
  }

  let backendUrl: string;
  if (config?.beUrl) {
    backendUrl = config.beUrl;
  } else {
    const url = new URL(request.url);
    const bePathname = url.pathname.replace(/^\/api/, '');
    backendUrl = env.BE_HOST + bePathname + url.search;
  }

  request.headers.set(env.BE_ID_KEY, env.BE_ID_VALUE);
  request.headers.set(env.BE_SECRET_KEY, env.BE_SECRET_VALUE);
  request.headers.set('X-Data-Center', request.cf?.colo ?? '');

  const beRequest: RequestInit = {
    body: request.body,
    headers: request.headers,
    method: request.method,
  };

  const start = performance.now();

  const beResponse = await fetch(backendUrl, beRequest);

  const end = performance.now();

  const testHeaders = new Headers(beResponse.headers);

  testHeaders.set('X-Backend-Response-Time', `${Math.round(end - start)}ms`);

  return new Response(JSON.stringify(await beResponse.json()), {
    status: beResponse.status,
    // headers: beResponse.headers,
    headers: testHeaders,
  });
};
