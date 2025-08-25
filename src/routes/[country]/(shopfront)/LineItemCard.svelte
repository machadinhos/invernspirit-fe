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
  const pushToastOnQuantityUpdate = rest.pushToastOnQuantityUpdate ?? true;

  let selectedQuantity = $state(product.quantity);
  let pendingRemoval = $state(false);

  const removeFromCart = async (): Promise<void> => {
    if (pendingRemoval) return;
    pendingRemoval = true;
    try {
      await cartState.removeProduct(product);
      gtag('event', 'remove_from_cart', {
        currency: country.currency.code,
        value: 0,
        items: [
          {
            /* eslint-disable camelcase */
            item_id: product.id,
            item_name: product.name,
            price: product.netPrice / 100,
            quantity: 0,
            /* eslint-enable camelcase */
          },
        ],
      });
    } catch {
      pendingRemoval = false;
    }
  };

  $effect(() => {
    if (product.quantity === selectedQuantity || pendingRemoval) return;
    if (selectedQuantity <= 0) {
      removeFromCart();
      return;
    }
    const action = product.quantity < selectedQuantity ? 'add_to_cart' : 'remove_from_cart';
    cartState
      .updateProductQuantity(product, selectedQuantity, pushToastOnQuantityUpdate)
      .catch(() => {
        selectedQuantity = cartState.getProductQuantity(product.id);
      })
      .then(() => {
        gtag('event', action, {
          currency: country.currency.code,
          value: (product.netPrice / 100) * selectedQuantity,
          items: [
            {
              /* eslint-disable camelcase */
              item_id: product.id,
              item_name: product.name,
              price: product.netPrice / 100,
              quantity: selectedQuantity,
              /* eslint-enable camelcase */
            },
          ],
        });
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
        class="absolute right-3 bottom-2 flex items-center justify-center text-primary"
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
