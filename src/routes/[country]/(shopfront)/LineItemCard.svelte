<script lang="ts">
  import { BiTrash } from 'svelte-icons-pack/bi';
  import { cart } from '$content';
  import { cart as cartState } from '$state';
  import { formatPrice } from '$lib/utils/currency-formatting';
  import { Icon } from 'svelte-icons-pack';
  import type { LineItem } from '$types';
  import { page } from '$app/state';
  import ProductQuantitySelector from './ProductQuantitySelector.svelte';

  type EditableProps =
    | {
        editable: true;
        pushToastOnQuantityUpdate?: boolean;
      }
    | {
        editable?: false;
        pushToastOnQuantityUpdate?: never;
      };

  type Props = EditableProps & {
    product: LineItem;
    country: { locale: string; currency: { code: string } };
    background?: boolean;
  };

  let { product, country, editable = false, background = true, ...rest }: Props = $props();
  const pushToastOnQuantityUpdate =
    'pushToastOnQuantityUpdate' in rest ? (rest.pushToastOnQuantityUpdate ?? true) : true;

  let selectedQuantity = $state(product.quantity);
  let pendingRemoval = $state(false);

  const removeFromCart = async (): Promise<void> => {
    if (pendingRemoval) return;
    pendingRemoval = true;
    try {
      await cartState.removeProduct(product);
    } catch {
      pendingRemoval = false;
    }
  };

  $effect(() => {
    if (product.quantity === selectedQuantity) return;
    cartState.updateProductQuantity(product, selectedQuantity, pushToastOnQuantityUpdate).catch(() => {
      selectedQuantity = cartState.getProductQuantity(product.id);
    });
  });
</script>

<div
  class={[
    'flex w-full flex-col gap-1.5 overflow-x-clip p-3',
    background && 'bg-background shadow-2xl',
    pendingRemoval && 'brightness-75',
  ]}
>
  <div class="relative flex w-full items-center justify-between">
    <div class="flex gap-4">
      <div class="h-[100px] w-[100px]">
        <a href="/{page.params.country}/shop/products/{product.id}">
          <img alt={product.images[0].alt} height="100" src={product.images[0].url} width="100" />
        </a>
      </div>
      <div>
        <a href="/{page.params.country}/shop/products/{product.id}">
          <h3 class="truncate text-2xl md:text-3xl">{product.name}</h3>
        </a>
        <h4 class="price text-xl md:text-2xl">
          {formatPrice(country.locale, country.currency.code, product.grossPrice)}
        </h4>
      </div>
    </div>
    {#if editable}
      <div class="absolute top-1/2 right-3 -translate-y-1/2">
        <ProductQuantitySelector allowZero disabled={pendingRemoval} stock={product.stock} bind:selectedQuantity />
      </div>
      <button
        class="text-primary absolute right-3 bottom-2 flex items-center justify-center"
        aria-label="remove-from-cart"
        disabled={pendingRemoval}
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
  {#if product.issues}
    {#each product.issues as issue (issue)}
      <div class="bg-error p-2">
        <p>{issue.message}</p>
      </div>
    {/each}
  {/if}
</div>
