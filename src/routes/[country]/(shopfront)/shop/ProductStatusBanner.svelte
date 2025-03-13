<script lang="ts">
  import { page } from '$app/state';
  import { shop } from '$content';

  type Props = {
    bucketStock: number | undefined;
    inCartQuantity: number | undefined;
    class?: HTMLElement['className'];
  };

  let { bucketStock, inCartQuantity, class: className }: Props = $props();

  type Banner = {
    text: string;
    bgColor: string;
    showInCartQuantity?: boolean;
    linkToCart?: boolean;
  };

  const banners: Record<string, Banner> = {
    allItemsInCart: {
      text: shop.products.cardBanner.allItemsInCart,
      bgColor: 'bg-warning',
      linkToCart: true,
    },
    someItemsInCart: {
      text: shop.products.cardBanner.someItemsInCart,
      bgColor: 'bg-background',
      showInCartQuantity: true,
      linkToCart: true,
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

{#snippet text(banner: Banner)}
  {#if banner.showInCartQuantity}
    {inCartQuantity}
  {/if}
  {banner.text}
{/snippet}

{#if banner}
  {#if banner.linkToCart}
    <a class="inline-block px-2 {banner.bgColor} {className}" href="/{page.params.country}/cart"
      >{@render text(banner)}</a
    >
  {:else}
    <div class="pointer-events-none inline-block px-2 select-none {banner.bgColor} {className}">
      {@render text(banner)}
    </div>
  {/if}
{/if}
