import { beClient } from '$service-server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const collection = await beClient.collections.getById(params.country, params.id);
  return {
    collection,
    openGraph: {
      type: 'product.group',
      'product:item_group_id': collection.id,
      title: `${collection.name} Collection`,
      description: collection.description,
      // TODO: add image to collection
      image: '/images/logo-with-background.webp',
    },
  };
};
