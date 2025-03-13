<script lang="ts">
  import { cart, config } from '$state';
  import type { Country, Product } from '$types';
  import { Button } from '$components';
  import { formatPrice } from '$lib/utils/currency-formating';
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
      const updateProductQuantityPromise = cart.updateProductQuantity(product, 1);
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

<article class="bg-background h-fit w-64 shadow-2xl transition-all duration-300 hover:scale-110">
  <div class="relative h-64">
    <ProductStatusBanner class="absolute top-2 left-2" {bucketStock} {inCartQuantity} />
    <a href="/{page.params.country}/shop/products/{product.id}">
      <img alt={product.images[0].alt} src={product.images[0].url} />
    </a>
  </div>
  <div class="px-4 pt-1 pb-3">
    <h2 class="truncate text-center text-3xl">{product.name}</h2>
    <div class="mt-2 flex items-center justify-between">
      <span class="price text-2xl">{formatPrice(country.locale, country.currency.code, product.grossPrice)}</span>
      <Button class="font-bold" disabled={bucketStock === undefined || availableStock <= 0} onclick={onAddToCartClick}
        >{shop.addToCartButtonLabel}</Button
      >
    </div>
  </div>
</article>
