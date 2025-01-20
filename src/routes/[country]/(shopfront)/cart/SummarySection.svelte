<script lang="ts">
  import { cart as cartState, loading } from '$state';
  import type { Country, LineItem } from '$types';
  import { bffClient } from '$service';
  import { Button } from '$components';
  import { cart } from '$content';
  import { formatPrice } from '$lib/utils/general';
  import { page } from '$app/state';

  interface Props {
    cartProducts: LineItem[] | undefined;
    country: Country;
  }

  let { cartProducts, country }: Props = $props();

  let totalPrice = $derived(cartProducts?.reduce((sum, item) => sum + item.grossPrice * item.quantity, 0));
  let subTotalPrice = $derived(cartProducts?.reduce((sum, item) => sum + item.netPrice * item.quantity, 0));
  let taxesPrices = $derived(getTaxesPrices());

  function getTaxesPrices(): { name: string; price: number | undefined }[] {
    return country.taxes.reduce(
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
      {/if}{country.currency.symbol}
    </span>
  </div>
{/snippet}

<div class="flex h-fit w-full flex-shrink-0 flex-col items-center lg:w-[400px] lg:bg-background lg:shadow-2xl">
  <div class="mt-4 flex w-full flex-col items-center">
    <h1 style="font-size: 2.5rem" class="text-center">
      {cart.summary}
    </h1>
    <div class="pointer-events-none h-0.5 w-28 select-none bg-white"></div>
  </div>
  <div class="mb-10 mt-5 flex h-fit w-[85%] flex-col justify-end overflow-hidden lg:h-[60vh]">
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
