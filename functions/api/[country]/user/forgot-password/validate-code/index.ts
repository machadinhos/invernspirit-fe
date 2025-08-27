import { beClientProxy } from '@utils';
import { Env } from '@types';

export const onRequestPost: PagesFunction<Env> = beClientProxy;
