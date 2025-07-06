<script lang="ts">
  import { cart as cartState, config, loading, modal, toasts, user } from '$state';
  import { Anchor } from '$components';
  import { AskForLoginModalComponent } from '$components-modals';
  import { bffClient } from '$service';
  import { cart } from '$content';
  import { ClientErrorToastComponent } from '$components-toasts';
  import { flip } from 'svelte/animate';
  import { goto } from '$app/navigation';
  import LineItemCard from '../LineItemCard.svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import type { PageData } from './$types';
  import SummarySection from '../SummarySection.svelte';

  type Props = {
    data: PageData;
  };

  let { data }: Props = $props();

  let cartLoaded = $state(false);

  const onCheckout = (): void => {
    const goToCheckout = (): Promise<void> => goto(`/${page.params.country}/checkout`);
    if (user.isLoggedIn) {
      goToCheckout();
    } else {
      modal.open(AskForLoginModalComponent, {
        action: goToCheckout,
        allowGuest: true,
      });
    }
  };

  onMount(() => {
    toasts.filterOutGroup('cart-update');

    loading.withLoading(async () => {
      await config.afterInitialization(async () => {
        await cartState.idle;
        const newCart = await bffClient.cart.get(page.params.country);
        cartState.setCart(newCart);

        cartLoaded = true;

        if (newCart.issues) {
          newCart.issues.forEach((issue) => {
            toasts.push(ClientErrorToastComponent, { extraParams: { error: issue }, type: 'error' });
          });
        }
      });
    });
  });
</script>

<svelte:head><title>{cart.headTitle}</title></svelte:head>

<div class="flex h-full w-full flex-col items-center">
  <div class="mt-4 mb-10 flex flex-col items-center">
    <h1 style="font-size: 2.5rem" class="text-center">
      {cart.title}
    </h1>
    <div class="pointer-events-none h-0.5 w-32 bg-white select-none"></div>
  </div>
  <div class="flex h-full w-full flex-col items-center md:flex-row md:items-start md:justify-center md:gap-5 lg:gap-10">
    <div class="flex w-[90%] max-w-[675px] flex-1 flex-col gap-4 md:mb-5 md:w-2/3">
      {#if config.isInitialized && cartLoaded}
        {#each cartState.value as product (product.id)}
          <div class="flex w-full justify-center" animate:flip={{ duration: 150 }}>
            <LineItemCard country={data.country} editable {product} pushToastOnQuantityUpdate={false} />
          </div>
        {:else}
          <div class="mt-24 text-center text-2xl md:flex md:gap-1.5">
            <span>{cart.emptyCartMessage}</span>
            <Anchor class="block" href="/{page.params.country}/shop/products">{cart.fillUpCTA}</Anchor>
          </div>
        {/each}
      {/if}
    </div>
    <div class="bg-secondary sticky -bottom-px mt-4 w-full md:top-0 md:mt-0 md:w-1/3 md:max-w-[396px]">
      <SummarySection buttonText={cart.checkoutButtonLabel} country={data.country} onclick={onCheckout} />
      <div class="mx-[10%] mb-5 hidden md:block">
        <div class="flex items-center gap-2">
          <div class="h-0.5 w-full bg-white"></div>
          {cart.or}
          <div class="h-0.5 w-full bg-white"></div>
        </div>
        <div class="w-full text-center">
          <Anchor href="/{page.params.country}/shop/products">{cart.continueShopping}</Anchor>
        </div>
      </div>
    </div>
  </div>
</div>
