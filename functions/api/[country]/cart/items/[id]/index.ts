import { beClientProxy } from '@utils';
import { Env } from '@types';

export const onRequestPut: PagesFunction<Env> = beClientProxy;
export const onRequestDelete: PagesFunction<Env> = beClientProxy;
