import { checkCaptchaToken } from './captcha-token-check.js';
import { Env } from '@types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type Config = {
  bePath?: string;
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
  if (config?.bePath) {
    backendUrl = env.BE_HOST + config.bePath;
  } else {
    const url = new URL(request.url);
    const bePathname = url.pathname.replace(/^\/api/, '');
    backendUrl = env.BE_HOST + bePathname + url.search;
  }

  request.headers.set(env.BE_ID_KEY, env.BE_ID_VALUE);
  request.headers.set(env.BE_SECRET_KEY, env.BE_SECRET_VALUE);

  const beRequest: RequestInit = {
    body: request.body,
    headers: request.headers,
    method: request.method,
  };

  const beResponse = await fetch(backendUrl, beRequest);

  return new Response(JSON.stringify(await beResponse.json()), {
    status: beResponse.status,
    headers: beResponse.headers,
  });
};

export const beClientProxyWithCaptcha = async (
  request: Request,
  allowedMethods: HttpMethod[],
  env: Env,
  config?: Config,
): Promise<Response> => {
  const { captchaToken: token } = (await request.clone().json()) as { captchaToken: string };
  if (!token) {
    return new Response(JSON.stringify({ issues: ['Captcha token not provided'] }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const remoteIp = request.headers.get('CF-Connecting-IP') ?? undefined;
  const isValidUser = await checkCaptchaToken({ token, secret: env.CF_CAPTCHA_SECRET_KEY, remoteIp });
  if (!isValidUser) {
    return new Response(JSON.stringify({ issues: ['Invalid captcha token'] }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return beClientProxy(request, allowedMethods, env, config);
};
