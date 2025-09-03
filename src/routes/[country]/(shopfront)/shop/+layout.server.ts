import { beClient } from '$service-server';
import type { Collection } from '$types';
import type { LayoutServerLoad } from './$types';

const cachedData: Record<string, { collections: Collection[] }> = {};

export const load: LayoutServerLoad = async ({ params }) => {
  if (!cachedData[params.country]) {
    cachedData[params.country] = { collections: await beClient.collections.getAll(params.country) };
  }
  return cachedData[params.country];
};
