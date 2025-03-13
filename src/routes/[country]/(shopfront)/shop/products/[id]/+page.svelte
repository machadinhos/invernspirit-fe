<script lang="ts">
  import { Anchor, Button, ThumbnailCarousel } from '$components';
  import { cart } from '$state';
  import { formatPrice } from '$lib/utils/currency-formating';
  import { getStockFromBucket } from '$service';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import type { PageData } from './$types';
  import ProductQuantitySelector from '../../../ProductQuantitySelector.svelte';
  import ProductStatusBanner from '../../ProductStatusBanner.svelte';
  import { shop } from '$content';

  type Props = {
    data: PageData;
  };

  let { data }: Props = $props();

  let selectedQuantity = $state(1);
  let bucketStock: number | undefined = $state();
  let inCartQuantity = $state(cart.getProductQuantity(data.product.id));
  let availableStock = $derived(bucketStock ? bucketStock - inCartQuantity : 0);

  onMount(async () => {
    bucketStock = (await getStockFromBucket(data.product.id)).data;
  });

  const onAddToCartClick = async (): Promise<void> => {
    try {
      const updateProductQuantityPromise = cart.updateProductQuantity(data.product, selectedQuantity);
      inCartQuantity += selectedQuantity;
      selectedQuantity = 1;
      await updateProductQuantityPromise;
    } catch {
      inCartQuantity = cart.getProductQuantity(data.product.id);
    }
  };
</script>

<svelte:head><title>{shop.products.headTitle}</title></svelte:head>

<div class="margins flex flex-col gap-5 lg:flex-row">
  <div class="flex justify-center lg:w-1/2">
    <ThumbnailCarousel images={data.product.images} />
  </div>
  <div class="lg:w-1/2">
    <h1 class="text-6xl lg:text-8xl">{data.product.name}</h1>
    <p class="price text-4xl lg:text-6xl">
      {formatPrice(data.country.locale, data.country.currency.code, data.product.grossPrice)}
    </p>
    <div class="my-5 h-px w-full bg-white"></div>
    <p class="min-h-24">{data.product.description}</p>
    <div class="my-5 h-px w-full bg-white"></div>
    <p>
      {shop.products.id.belongsToCollectionStart}
      <Anchor href="/{page.params.country}/shop/collections/{data.product.collection.id}"
        >{data.product.collection.name}</Anchor
      >
      {shop.products.id.belongsToCollectionEnd}
    </p>
    <div class="my-4 flex gap-3">
      <ProductQuantitySelector disabled={bucketStock === undefined} stock={availableStock} bind:selectedQuantity />
      <p>{shop.products.id.available}: {bucketStock}</p>
      <ProductStatusBanner {bucketStock} {inCartQuantity} />
    </div>
    <Button
      class="w-full font-bold"
      disabled={bucketStock === undefined || availableStock <= 0}
      onclick={onAddToCartClick}>{shop.addToCartButtonLabel}</Button
    >
  </div>
</div>
