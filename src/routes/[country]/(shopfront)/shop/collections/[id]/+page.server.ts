import { beClient } from '$service-server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  return { collection: await beClient.collections.getById(params.country, params.id) };
};
