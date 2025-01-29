import { beClient } from '$service-server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  return { products: await beClient.products.getAll(params.country) };
};
