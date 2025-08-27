import { beClientProxy } from '@utils';
import { Env } from '@types';

export const onRequestGet: PagesFunction<Env> = beClientProxy;
export const onRequestPost: PagesFunction<Env> = beClientProxy;
