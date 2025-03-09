<script lang="ts">
  import { BiTrash } from 'svelte-icons-pack/bi';
  import { cart } from '$content';
  import { cart as cartState } from '$state';
  import { formatPrice } from '$lib/utils/currency-formating';
  import { Icon } from 'svelte-icons-pack';
  import type { LineItem } from '$types';
  import { page } from '$app/state';
  import ProductQuantitySelector from './ProductQuantitySelector.svelte';

  type Props = {
    product: LineItem;
    country: { locale: string; currency: { code: string } };
    editable?: boolean;
  };

  let { product, country, editable = false }: Props = $props();

  let selectedQuantity = $state(product.quantity);
  let oldQuantity = product.quantity;

  $effect(() => {
    if (product.quantity === selectedQuantity || oldQuantity === selectedQuantity) return;
    const quantityDifference = selectedQuantity - oldQuantity;
    oldQuantity = selectedQuantity;
    cartState.insertProduct(product, quantityDifference);
  });

  const removeFromCart = (): void => {
    cartState.removeProduct(product);
  };
</script>

<div class="bg-background flex w-full flex-col gap-1.5 overflow-x-hidden p-3 shadow-2xl">
  <div class="relative flex w-full items-center justify-between">
    <div class="flex gap-4">
      <div class="h-[100px] w-[100px]">
        <a href="/{page.params.country}/shop/products/{product.id}">
          <img alt={product.images[0].alt} height="100" src={product.images[0].url} width="100" />
        </a>
      </div>
      <div>
        <h3 class="truncate text-3xl">{product.name}</h3>
        <h4 class="price text-2xl">
          {formatPrice(country.locale, country.currency.code, product.grossPrice)}
        </h4>
      </div>
    </div>
    {#if editable}
      <div class="absolute top-1/2 right-3 -translate-y-1/2">
        <ProductQuantitySelector allowZero stock={product.stock} bind:selectedQuantity />
      </div>
      <button
        class="text-primary absolute right-3 bottom-2 flex items-center justify-center"
        aria-label="remove-from-cart"
        onclick={removeFromCart}
        type="button"
      >
        <span class="text-xs">{cart.remove}</span>
        <Icon size="10" src={BiTrash} />
      </button>
    {:else}
      <h4 class="absolute top-1/2 right-3 -translate-y-1/2 text-2xl">x {product.quantity}</h4>
    {/if}
  </div>
  {#if product.issues && product.issues.length > 0}
    {#each product.issues as issue (issue)}
      <div class="bg-error p-2">
        <p>{issue.message}</p>
      </div>
    {/each}
  {/if}
</div>
