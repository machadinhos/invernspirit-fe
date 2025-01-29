<script lang="ts">
  import { formatPrice } from '$lib/utils/currency-formating';
  import type { Order } from '$types';
  import { order as orderContent } from '$content';

  type Props = {
    order: Order;
    country: { locale: string; currency: { code: string } };
  };

  let { order, country }: Props = $props();
</script>

{#snippet priceLine(text: string, price: number, textSize: 'text-2xl' | 'text-4xl')}
  <div class="flex place-content-between {textSize}">
    <span>{text}:</span>
    <span class="price">
      {formatPrice(country.locale, country.currency.code, price)}
    </span>
  </div>
{/snippet}

<div class="bg-secondary flex w-full justify-center p-5">
  <div class="flex w-full flex-col justify-end">
    {@render priceLine(orderContent.subtotal, order.payment.netAmount, 'text-2xl')}
    {@render priceLine(orderContent.shipping, order.shippingMethod.rate.priceInCents, 'text-2xl')}
    {#each order.taxes as tax (tax.name)}
      {@render priceLine(`${tax.name} (${tax.rate * 100}%)`, tax.amount, 'text-2xl')}
    {/each}
    <div class="mt-2 w-full">
      <div class="mb-3 flex flex-col gap-0.5">
        <div class="h-0.5 bg-white"></div>
        {@render priceLine(orderContent.total, order.payment.grossAmount, 'text-4xl')}
        <div class="h-0.5 bg-white"></div>
      </div>
    </div>
  </div>
</div>
