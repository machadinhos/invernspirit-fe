import { beClient } from '$service-server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  return { product: await beClient.products.getById(params.country, params.id) };
};
