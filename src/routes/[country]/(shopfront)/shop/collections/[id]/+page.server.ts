import { beClient } from '$service-server';
import type { PageServerLoad } from './$types';
import { PUBLIC_FE_HOST } from '$env/static/public';

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
      image: `${PUBLIC_FE_HOST}/images/logo-with-background.webp`,
    },
  };
};
