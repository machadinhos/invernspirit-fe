<script lang="ts">
  import { BiTrash } from 'svelte-icons-pack/bi';
  import { cart } from '$content';
  import { formatPrice } from '$lib/utils/general';
  import { Icon } from 'svelte-icons-pack';
  import type { LineItem } from '$types';
  import ProductQuantitySelector from '../ProductQuantitySelector.svelte';

  interface Props {
    product: LineItem;
    cartProducts: LineItem[];
  }

  let { product, cartProducts = $bindable() }: Props = $props();

  let selectedQuantity = $state(product.quantity);

  $effect(() => {
    product.quantity = selectedQuantity;
    cartProducts = cartProducts;
  });

  function removeFromCart() {
    cartProducts = cartProducts.filter((item) => item.id !== product.id);
  }
</script>

<div class="flex w-full items-center justify-between rounded-md p-3 sm:w-96 lg:bg-background-dark">
  <div class="flex gap-4">
    <div class="h-[100px] w-[100px]">
      <a href="shop/products/{product.id}">
        <img alt={product.images[0].alt} height="100" src={product.images[0].url} width="100" />
      </a>
    </div>
    <div>
      <h3 class="w-40 truncate text-2xl sm:w-auto sm:text-3xl">{product.name}</h3>
      <h4 class="text-lg">{cart.priceLabel}: {formatPrice(product.grossPrice)}$</h4>
      <div class="flex gap-1">
        <h4 class="text-lg">{cart.quantityLabel}:</h4>
        <ProductQuantitySelector stock={product.stock} bind:selectedQuantity />
      </div>
    </div>
  </div>
  <div class="text-primary">
    <button class="h-7 w-7" aria-label="remove-from-cart" onclick={removeFromCart} type="button">
      <Icon size="20" src={BiTrash} />
    </button>
  </div>
</div>
