import { Env } from '@types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export const beClientProxy = async (
  request: Request,
  allowedMethods: HttpMethod[],
  env: Env,
  filterFunction?: (request: Request) => Response | undefined,
): Promise<Response> => {
  const errorResponse = filterFunction?.(request);
  if (errorResponse) return errorResponse;
  if (!request.cf) throw new Error('platform is not defined');
  if (!allowedMethods.includes(request.method as HttpMethod)) {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = new URL(request.url);
  const bePathname = url.pathname.replace(/^\/api/, '');
  const backendUrl = env.BE_HOST + bePathname + url.search;

  const headers = {
    [env.BE_ID_KEY]: env.BE_ID_VALUE,
    [env.BE_SECRET_KEY]: env.BE_SECRET_VALUE,
  };

  const requestHeaders = new Headers(request.headers);
  const requiredHeaders = { country: request.cf.country as string, ...headers };
  Object.entries(requiredHeaders).forEach(([key, value]) => {
    requestHeaders.set(key, value);
  });

  const hasBody = request.method !== 'GET' && request.method !== 'DELETE';

  const beRequest: RequestInit = {
    ...(hasBody && { body: JSON.stringify(await request.json()) }),
    headers: requestHeaders,
    method: request.method,
  };

  const beResponse = await fetch(backendUrl, beRequest);

  const responseHeaders = new Headers(beResponse.headers);

  return new Response(JSON.stringify(await beResponse.json()), {
    status: beResponse.status,
    headers: responseHeaders,
  });
};
