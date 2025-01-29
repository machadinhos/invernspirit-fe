<script lang="ts">
  import { shop } from '$content';

  type Props = {
    bucketStock: number | undefined;
    inCartQuantity: number | undefined;
  };

  let { bucketStock, inCartQuantity }: Props = $props();

  type Banner = {
    text: string;
    bgColor: string;
  };

  const banners: Record<string, Banner> = {
    allItemsInCart: {
      text: shop.products.cardBanner.allItemsInCart,
      bgColor: 'bg-warning',
    },
    someItemsInCart: {
      text: shop.products.cardBanner.someItemsInCart,
      bgColor: 'bg-background',
    },
    outOfStock: {
      text: shop.products.cardBanner.outOfStock,
      bgColor: 'bg-error',
    },
  };

  const getCurrentBanner = (): Banner | undefined => {
    if (bucketStock === undefined || inCartQuantity === undefined) return;
    if (bucketStock === 0) return banners.outOfStock;
    if (inCartQuantity === 0) return;
    if (bucketStock <= inCartQuantity) return banners.allItemsInCart;
    return banners.someItemsInCart;
  };

  let banner: Banner | undefined = $derived(getCurrentBanner());
</script>

{#if banner}
  <div class="px-2 {banner.bgColor}">{banner.text}</div>
{/if}
