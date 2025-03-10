<script lang="ts">
  import { checkout, order as orderContent } from '$content';
  import type { Country, Order, OrderStatus } from '$types';
  import { copiedToClipboardToastSnippet } from '$lib/components/snippets/CopiedToClipboardToastSnippet.svelte';
  import { FaCopy } from 'svelte-icons-pack/fa';
  import { formatDate } from '$lib/utils/date-formating';
  import { formatPrice } from '$lib/utils/currency-formating';
  import { Icon } from 'svelte-icons-pack';
  import LineItemCard from '../LineItemCard.svelte';
  import OrderInfoCard from './OrderInfoCard.svelte';
  import PriceSummary from './PriceSummary.svelte';
  import { toasts } from '$state';

  type Props = {
    order: Order;
    country: Country;
  };

  let { order, country }: Props = $props();

  const onOrderIdClick = (): void => {
    if (!order) return;
    navigator.clipboard.writeText(order.id);
    toasts.push(copiedToClipboardToastSnippet, { group: 'clipboard', singleton: true });
  };

  const mapStatusToText = (status: OrderStatus): string => {
    switch (status) {
      case 'completed':
        return orderContent.status.completed;
      case 'canceled':
        return orderContent.status.canceled;
      case 'processing_payment':
        return orderContent.status.processingPayment;
      case 'packaging':
        return orderContent.status.packaging;
      case 'shipping':
        return orderContent.status.shipping;
      case 'error':
        return orderContent.status.error;
      default:
        return status;
    }
  };

  const paymentLogos = {
    paypal: '/paypal-logo.webp',
    visa: '/visa-logo.webp',
    masterCard: '/mastercard-logo.webp',
  };

  const mapCardBrandToLogo = (brand: string): string | undefined => {
    switch (brand) {
      case 'visa':
        return paymentLogos.visa;
      case 'mastercard':
        return paymentLogos.masterCard;
    }
  };
</script>

<div class="flex w-full flex-1 flex-col items-center md:flex-row md:items-start md:justify-center md:gap-10">
  <div class="flex w-[90%] max-w-[675px] flex-1 flex-col gap-4 md:mb-5 md:w-2/3">
    <div class="flex gap-1">
      {orderContent.orderId}:
      <button class="text-primary flex items-center gap-1" onclick={onOrderIdClick} type="button">
        <span class="text-white">{order.id}</span>
        <Icon src={FaCopy} />
      </button>
    </div>
    <p>{orderContent.dateOfPurchase}: {formatDate(country, order.createdAt)}</p>
    {#if order.payment.paymentMethod}
      {#if order.payment.paymentMethod.type === 'card'}
        {#if order.payment.paymentMethod.brand && order.payment.paymentMethod.last4}
          <p class="flex gap-1">
            {orderContent.paymentMethod}:
            {#if mapCardBrandToLogo(order.payment.paymentMethod.brand ?? '')}
              <img
                class="h-[22px] w-[34px]"
                alt="card logo"
                src="/payment-logos/{mapCardBrandToLogo(order.payment.paymentMethod.brand ?? '')}"
              />
            {/if}
            {order.payment.paymentMethod.brand}
            {orderContent.cardEndingIn}
            {order.payment.paymentMethod.last4}
          </p>
        {:else}
          <p>{orderContent.paymentMethod}: {orderContent.card}</p>
        {/if}
      {:else if order.payment.paymentMethod.type === 'paypal'}
        <p class="flex gap-1">
          {orderContent.paymentMethod}:
          <img alt="paypal logo" src="/payment-logos/{paymentLogos.paypal}" />
          paypal
        </p>
      {:else}
        <p class="flex gap-1">
          {orderContent.paymentMethod}:
          {order.payment.paymentMethod.type}
        </p>
      {/if}
    {/if}
    <p>
      {orderContent.statusLabel}:
      <span style="color: {order.status === 'completed' ? 'green' : order.status === 'canceled' ? 'red' : 'white'}"
        >{mapStatusToText(order.status)}</span
      >
    </p>
    <OrderInfoCard title={orderContent.personalDetails.title}>
      <p>{orderContent.personalDetails.parts.email.title}: {order.personalDetails.email}</p>
      <p>
        {orderContent.personalDetails.fullName}: {order.personalDetails.firstName}
        {order.personalDetails.lastName}
      </p>
    </OrderInfoCard>
    <OrderInfoCard title={orderContent.address.title}>
      <p>{orderContent.address.parts.street.title}: {order.address.street}</p>
      <p>{orderContent.address.parts.postalCode.title}: {order.address.postalCode}</p>
      <p>{orderContent.address.parts.houseNumber.title}: {order.address.houseNumber}</p>
      {#if order.address.apartment}
        <p>{orderContent.address.parts.apartment.title}: {order.address.apartment}</p>
      {/if}
      <p>{orderContent.address.parts.city.title}: {order.address.city}</p>
      {#if order.address.province}
        <p>{orderContent.address.parts.province.title}: {order.address.province}</p>
      {/if}
    </OrderInfoCard>
    <OrderInfoCard title={orderContent.shippingMethod.title}>
      <p>{orderContent.shippingMethod.shippingCompany}: {order.shippingMethod.name}</p>
      <p>{orderContent.shippingMethod.deliveryTime}: {order.shippingMethod.rate.deliveryTime} days</p>
      <p class="price">
        {orderContent.shippingMethod.price}: {formatPrice(
          country.locale,
          order.currency.code,
          order.shippingMethod.rate.priceInCents,
        )}
      </p>
    </OrderInfoCard>
    <div>
      <div class="mb-2 flex w-full flex-col items-center">
        <h3 style="font-size: 2rem" class="text-center">{checkout.reviewPage.products}</h3>
        <div class="pointer-events-none h-0.5 w-24 bg-white select-none"></div>
      </div>
      <div class="flex flex-col items-center gap-5 xl:overflow-y-auto">
        {#each order.products as product (product.id)}
          <LineItemCard country={{ locale: country.locale, currency: { code: order.currency.code } }} {product} />
        {/each}
      </div>
    </div>
  </div>
  <div class="mt-3 w-full md:sticky md:top-0 md:mt-0 md:w-1/3 md:max-w-[396px]">
    <PriceSummary country={{ locale: country.locale, currency: { code: order.currency.code } }} {order} />
  </div>
</div>
