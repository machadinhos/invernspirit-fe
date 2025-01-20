<script lang="ts">
  import { cart as cartState, config } from '$state';
  import { bffClient } from '$service';
  import { cart } from '$content';
  import CartItem from './CartItem.svelte';
  import { flip } from 'svelte/animate';
  import type { LineItem } from '$types';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import type { PageData } from './$types';
  import { PulsatingLogo } from '$components';
  import SummarySection from './SummarySection.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let cartProducts: LineItem[] | undefined = $state();

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
</script>

<div class="mx-2 mt-10 flex flex-col justify-center gap-8 sm:mx-5 lg:mx-10 lg:flex-row">
  <div class="flex h-fit w-full flex-col items-center lg:bg-background lg:shadow-2xl">
    <div class="mt-4 flex w-full flex-col items-center">
      <h1 style="font-size: 2.5rem" class="text-center">
        {cart.title}
      </h1>
      <div class="pointer-events-none h-0.5 w-40 select-none bg-white"></div>
    </div>
    <div class="mb-10 mt-5 flex h-[50vh] w-full flex-col place-content-between overflow-hidden lg:h-[60vh]">
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
  <SummarySection {cartProducts} country={data.country} />
</div>
