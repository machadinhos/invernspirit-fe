import { beClientProxy, checkCaptchaToken } from '@utils';
import { Env } from '@types';

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
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

  return beClientProxy(request, ['POST'], env);
};
