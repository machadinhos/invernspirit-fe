type CaptchaOptions = {
  token: string;
  secret: string;
  remoteIp: string | undefined;
};

export const checkCaptchaToken = async ({ token, secret, remoteIp }: CaptchaOptions): Promise<boolean> => {
  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const outCome = (await (
    await fetch(url, {
      body: JSON.stringify({
        secret: secret,
        response: token,
        ...(remoteIp && { remoteip: remoteIp }),
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json()) as { success: boolean };

  return outCome.success;
};
