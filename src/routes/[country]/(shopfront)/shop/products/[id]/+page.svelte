<script lang="ts">
  import { Anchor, Button, ThumbnailCarousel } from '$components';
  import { cart, config, toasts } from '$state';
  import { CopiedToClipboardToast } from '$components-toasts';
  import { formatPrice } from '$lib/utils/currency-formatting';
  import { getStockFromBucket } from '$service';
  import { Icon } from 'svelte-icons-pack';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import type { PageData } from './$types';
  import ProductQuantitySelector from '../../../ProductQuantitySelector.svelte';
  import ProductStatusBanner from '../../ProductStatusBanner.svelte';
  import { RiSystemShareLine } from 'svelte-icons-pack/ri';
  import { shop } from '$content';

  type Props = {
    data: PageData;
  };

  let { data }: Props = $props();

  let selectedQuantity = $state(1);
  let bucketStock: number | undefined = $state();
  let inCartQuantity: number | undefined = $state();
  let availableStock = $derived(
    bucketStock !== undefined && inCartQuantity !== undefined ? bucketStock - inCartQuantity : 0,
  );

  const onAddToCartClick = async (): Promise<void> => {
    if (bucketStock === undefined || inCartQuantity === undefined || availableStock < selectedQuantity) return;
    try {
      const updateProductQuantityPromise = cart.patchProductQuantity(data.product, selectedQuantity);
      gtag('event', 'add_to_cart', {
        currency: data.country.currency.code,
        value: (data.product.netPrice / 100) * selectedQuantity,
        items: [
          {
            /* eslint-disable camelcase */
            item_id: data.product.id,
            item_name: data.product.name,
            price: data.product.netPrice / 100,
            quantity: selectedQuantity,
            /* eslint-enable camelcase */
          },
        ],
      });
      inCartQuantity += selectedQuantity;
      selectedQuantity = 1;
      await updateProductQuantityPromise;
    } catch {
      inCartQuantity = cart.getProductQuantity(data.product.id);
    }
  };

  const onShareClick = async (): Promise<void> => {
    try {
      if (!navigator.share) {
        await navigator.clipboard.writeText(`${page.url.origin}${page.url.pathname}`);
        toasts.push(CopiedToClipboardToast, { tag: 'clipboard' });
      } else {
        await navigator.share({
          title: data.product.name,
          text: 'Check out this product:',
          url: `${page.url.origin}${page.url.pathname}`,
        });
      }

      gtag('event', 'share', {
        /* eslint-disable camelcase */
        item_id: data.product.id,
        /* eslint-enable camelcase */
      });
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error(error);
    }
  };

  onMount(async () => {
    bucketStock = (await getStockFromBucket(data.product.id)).data;
    config.afterInitialization(() => {
      inCartQuantity = cart.getProductQuantity(data.product.id);
    });
  });
</script>

<svelte:head><title>{`${shop.products.id.headTitle}${data.product.name}`}</title></svelte:head>

<div class="margins flex flex-col gap-5 lg:flex-row">
  <div class="flex justify-center lg:w-1/2">
    <ThumbnailCarousel images={data.product.images} />
  </div>
  <div class="lg:w-1/2">
    <h1 class="text-6xl lg:text-8xl">{data.product.name}</h1>
    <div class="flex items-center justify-between">
      <p class="price text-4xl lg:text-6xl">
        {formatPrice(data.country.locale, data.country.currency.code, data.product.grossPrice)}
      </p>
      <button class="p-0.5" onclick={onShareClick} type="button">
        <Icon size="25" src={RiSystemShareLine} />
      </button>
    </div>
    <div class="my-5 h-px w-full bg-white"></div>
    <p class="min-h-24 text-justify">{data.product.description}</p>
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
      <p>{shop.products.id.stock}: {bucketStock}</p>
      <ProductStatusBanner {bucketStock} {inCartQuantity} />
    </div>
    <Button
      class="font-bold"
      disabled={bucketStock === undefined || availableStock === undefined || availableStock <= 0}
      fullWidth
      onclick={onAddToCartClick}>{shop.addToCartButtonLabel}</Button
    >
  </div>
</div>
