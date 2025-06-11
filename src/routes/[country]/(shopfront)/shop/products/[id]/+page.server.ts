import { beClient } from '$service-server';
import type { Country } from '$types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const product = await beClient.products.getById(params.country, params.id);
  return {
    product,
    openGraph: {
      type: 'product.item',
      'product:item_group_id': product.collection.id,
      'product:retailer_item_id': product.id,
      'product:price:amount': (product.grossPrice / 100).toFixed(2),
      'product:price:currency': (
        (await beClient.countries.getAll()).find((country) => country.code === params.country.toUpperCase()) as Country
      ).currency.code,
      'product:condition': 'new',
      title: product.name,
      description: product.description,
      image: product.images[0].url,
    },
  };
};
