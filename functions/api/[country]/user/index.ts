import { beClientProxy } from '@utils';
import { Env } from '@types';

export const onRequestGet: PagesFunction<Env> = beClientProxy;
export const onRequestDelete: PagesFunction<Env> = beClientProxy;
