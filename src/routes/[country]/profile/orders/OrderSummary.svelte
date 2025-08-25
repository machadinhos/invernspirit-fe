<script lang="ts">
  import type { Country, Order } from '$types';
  import { Anchor } from '$components';
  import { formatPrice } from '$lib/utils/currency-formatting';
  import LineItemCard from '../../(shopfront)/LineItemCard.svelte';
  import { page } from '$app/state';
  import { profile } from '$content';

  type Props = {
    order: Order;
    country: Country;
  };

  let { order, country }: Props = $props();

  const productLength = order.products.reduce((total, product) => total + product.quantity, 0);
</script>

<div class="w-full bg-background-dark">
  <div class="bg-background pb-2 shadow-2xl">
    <LineItemCard
      background={false}
      country={{ locale: country.locale, currency: { code: order.currency.code } }}
      product={order.products[0]}
    />
    {#if order.products.length > 1}
      <p class="ml-2 text-2xl">+{productLength - order.products[0].quantity} {profile.orders.moreProducts}</p>
    {/if}
  </div>
  <div class="flex justify-between p-2 text-3xl">
    <h3>{profile.orders.total}</h3>
    <h3 class="price">
      {formatPrice(country.locale, country.currency.code, order.payment.grossAmount)}
    </h3>
  </div>
  <div class="mb-2 flex w-full justify-center">
    <Anchor class="text-xl md:text-2xl" href="/{page.params.country}/order?id={order.id}"
      >{profile.orders.viewOrder}</Anchor
    >
  </div>
</div>
