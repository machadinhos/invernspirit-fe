import type { RequestHostContext } from '../client';

export type Endpoint<Result, Args extends unknown[] = []> = (
  context: RequestHostContext,
) => (countryCode: string, ...args: Args) => Promise<Result>;
