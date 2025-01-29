import type { RequestHostContext } from '../client';

export type Endpoint<T, Args extends unknown[] = []> = (
  context: RequestHostContext,
) => (countryCode: string, ...args: Args) => Promise<T>;
