<script lang="ts">
  import { Button, PulsatingLogo } from '$components';
  import { cart as cartState, config, loading } from '$state';
  import { bffClient } from '$service';
  import { cart } from '$content';
  import CartItem from './CartItem.svelte';
  import { flip } from 'svelte/animate';
  import { formatPrice } from '$lib/utils/general';
  import type { LineItem } from '$types';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let cartProducts: LineItem[] | undefined = $state();
  let totalPrice = $derived(cartProducts?.reduce((sum, item) => sum + item.grossPrice * item.quantity, 0));
  let subTotalPrice = $derived(cartProducts?.reduce((sum, item) => sum + item.netPrice * item.quantity, 0));
  let taxesPrices = $derived(getTaxesPrices());

  function getTaxesPrices(): { name: string; price: number | undefined }[] {
    return data.country.taxes.reduce(
      (taxList, tax) => {
        const name = tax.name;
        const price = cartProducts?.reduce(
          (total, lineItem) => total + lineItem.netPrice * lineItem.quantity * tax.rate,
          0,
        );
        taxList.push({ name, price });
        return taxList;
      },
      [] as { name: string; price: number | undefined }[],
    );
  }

  onMount(() => {
    config.afterInitialization(async () => {
      if (cartState.size === 0) {
        cartProducts = [];
        return;
      }
      cartProducts = (await bffClient.getCart(cartState.getCartArray(), page.params.country)).products;
    });
  });

  $effect(() => {
    if (cartProducts !== undefined) cartState.setCartFromLineItemArray(cartProducts);
  });

  async function onCheckout() {
    loading.value = true;
    const checkout = await bffClient.checkout({ products: cartState.getCartArray() }, page.params.country);
    loading.value = false;
    window.location.assign(checkout.url);
  }
</script>

{#snippet priceLine(text: string, price: number | undefined, textSize: 'text-2xl' | 'text-4xl')}
  <div class="flex place-content-between {textSize}">
    <span>{text}:</span>
    <span>
      {#if price !== undefined}
        {formatPrice(price)}
      {:else}
        --.--
      {/if}{data.country.currency.symbol}
    </span>
  </div>
{/snippet}

<div class="mx-2 mt-10 flex flex-col justify-center gap-8 sm:mx-5 lg:mx-10 lg:flex-row">
  <div class="flex h-fit w-full flex-col items-center bg-background shadow-2xl">
    <div class="mt-4 flex w-full flex-col items-center">
      <h1 style="font-size: 2.5rem" class="text-center">
        {cart.title}
      </h1>
      <div class="pointer-events-none h-0.5 w-40 select-none bg-white"></div>
    </div>
    <div class="mb-10 mt-5 flex h-[60vh] w-full flex-col place-content-between overflow-hidden">
      {#if cartProducts !== undefined}
        {#if cartProducts.length > 0}
          <div
            class="grid grid-cols-[repeat(auto-fit,minmax(384px,1fr))] justify-center justify-items-center gap-6 overflow-y-auto overflow-x-hidden sm:gap-12 lg:mx-4"
          >
            {#each cartProducts as product (product.id)}
              <div animate:flip={{ duration: 150 }}>
                <CartItem {product} bind:cartProducts />
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-center">
            {cart.emptyCartMessage}
            <a class="text-primary underline" href="/{page.params.country}/shop/products">{cart.fillUpCTA}</a>
          </p>
        {/if}
      {:else}
        <div class="flex h-full w-full items-center justify-center">
          <PulsatingLogo />
        </div>
      {/if}
    </div>
  </div>
  <div class="flex h-fit w-full flex-shrink-0 flex-col items-center bg-background shadow-2xl lg:w-[400px]">
    <div class="mt-4 flex w-full flex-col items-center">
      <h1 style="font-size: 2.5rem" class="text-center">
        {cart.summary}
      </h1>
      <div class="pointer-events-none h-0.5 w-28 select-none bg-white"></div>
    </div>
    <div class="mb-10 mt-5 flex h-[60vh] w-[85%] flex-col justify-end overflow-hidden">
      {@render priceLine(cart.subtotal, subTotalPrice, 'text-2xl')}
      {#each taxesPrices as taxPrice}
        {@render priceLine(taxPrice.name, taxPrice.price, 'text-2xl')}
      {/each}
      <div class="mt-2 w-full">
        <div class="mb-3 flex flex-col gap-0.5">
          <div class="h-0.5 bg-white"></div>
          {@render priceLine(cart.total, totalPrice, 'text-4xl')}
          <div class="h-0.5 bg-white"></div>
        </div>
        <Button
          className="w-full"
          disabled={cartProducts !== undefined ? cartProducts.length < 1 : true}
          onclick={onCheckout}>{cart.checkoutButtonLabel}</Button
        >
      </div>
    </div>
  </div>
</div>
