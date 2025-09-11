import type { Jsonable } from '$types';
import type { RequestHostContext } from '../client';

export type Endpoint<Result extends Jsonable, Args extends unknown[] = []> = (
  context: RequestHostContext,
  countryCode: string | undefined,
  ...args: Args
) => Promise<Result>;
