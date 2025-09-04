<script lang="ts">
  import { cart, config } from '$state';
  import type { Country, Product } from '$types';
  import { Button } from '$components';
  import { formatPrice } from '$lib/utils/currency-formatting';
  import { getStockFromBucket } from '$service';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import ProductStatusBanner from './ProductStatusBanner.svelte';
  import { shop } from '$content';

  type Props = {
    product: Product;
    country: Country;
  };

  let { product, country }: Props = $props();

  let bucketStock: number | undefined = $state();
  let inCartQuantity: number | undefined = $state();
  let availableStock = $derived(bucketStock && inCartQuantity !== undefined ? bucketStock - inCartQuantity : 0);

  const onAddToCartClick = async (): Promise<void> => {
    if (inCartQuantity === undefined) return;
    try {
      const updateProductQuantityPromise = cart.patchProductQuantity(product, 1);
      gtag('event', 'add_to_cart', {
        currency: country.currency.code,
        value: product.netPrice / 100,
        items: [
          {
            /* eslint-disable camelcase */
            item_id: product.id,
            item_name: product.name,
            price: product.netPrice / 100,
            quantity: 1,
            /* eslint-enable camelcase */
          },
        ],
      });
      inCartQuantity += 1;
      await updateProductQuantityPromise;
    } catch {
      inCartQuantity = cart.getProductQuantity(product.id);
    }
  };

  onMount(() => {
    config.afterInitialization(() => {
      inCartQuantity = cart.getProductQuantity(product.id);
    });
    (async (): Promise<void> => {
      bucketStock = (await getStockFromBucket(product.id)).data;
    })();
  });
</script>

<article class="relative w-64 bg-background shadow-2xl transition-[scale] duration-300 hover:scale-110">
  <ProductStatusBanner class="absolute top-2 left-2" {bucketStock} {inCartQuantity} />
  <a href="/{page.params.country}/shop/products/{product.id}">
    <img class="aspect-square w-full" alt={product.images[0].alt} src={product.images[0].url} />
  </a>
  <div class="px-4 pt-1 pb-3">
    <a href="/{page.params.country}/shop/products/{product.id}">
      <h2 class="truncate text-center text-3xl">{product.name}</h2>
    </a>
    <div class="mt-2 flex items-center justify-between">
      <span class="price text-2xl">{formatPrice(country.locale, country.currency.code, product.grossPrice)}</span>
      <Button class="font-bold" disabled={bucketStock === undefined || availableStock <= 0} onclick={onAddToCartClick}
        >{shop.addToCartButtonLabel}</Button
      >
    </div>
  </div>
</article>
