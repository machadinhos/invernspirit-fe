import { beClientProxyWithCaptcha } from '@utils';
import { Env } from '@types';

export const onRequestPost: PagesFunction<Env> = beClientProxyWithCaptcha;
