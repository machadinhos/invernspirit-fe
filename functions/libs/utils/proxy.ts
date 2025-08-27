import { checkCaptchaToken } from './captcha-token-check.js';
import { Env } from '@types';

type Config = {
  bePath?: string;
};

type ProxyPagesFunction = (...args: [...Parameters<PagesFunction<Env>>, Config?]) => ReturnType<PagesFunction<Env>>;

export const beClientProxy: ProxyPagesFunction = async ({ request, env }, config?: Config) => {
  const backendUrl = config?.bePath
    ? env.BE_HOST + config.bePath
    : ((): string => {
        const url = new URL(request.url);
        return env.BE_HOST + url.pathname.replace(/^\/api/, '') + url.search;
      })();

  request.headers.set(env.BE_ID_KEY, env.BE_ID_VALUE);
  request.headers.set(env.BE_SECRET_KEY, env.BE_SECRET_VALUE);

  const beRequest: RequestInit = {
    body: request.body,
    headers: request.headers,
    method: request.method,
  };

  const beResponse = await fetch(backendUrl, beRequest);

  return new Response(beResponse.body, {
    status: beResponse.status,
    headers: beResponse.headers,
  });
};

export const generateBeClientProxyWithConfig = (
  beClientProxy: ProxyPagesFunction,
  config: Config,
): ProxyPagesFunction => {
  return (context) => beClientProxy(context, config);
};

export const beClientProxyWithCaptcha: ProxyPagesFunction = async (context, config?: Config) => {
  const { request, env } = context;
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

  return beClientProxy(context, config);
};
