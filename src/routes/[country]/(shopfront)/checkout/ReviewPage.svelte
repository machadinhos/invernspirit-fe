<script lang="ts">
  import type { Country, Review, StageName } from '$types';
  import { bffClient } from '$service';
  import { checkout } from '$content';
  import { formatPrice } from '$lib/utils/currency-formatting';
  import { goto } from '$app/navigation';
  import LineItemCard from '../LineItemCard.svelte';
  import { loading } from '$state';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import ReviewSection from './ReviewSection.svelte';

  type Props = {
    country: Country;
    shippingCost: number;
    onStageSubmit: ((e: SubmitEvent) => void) | undefined;
  };

  let { country, shippingCost = $bindable(), onStageSubmit = $bindable() }: Props = $props();

  let review: Review | undefined = $state();

  const generateGoToSectionClick = (stage: StageName): (() => void) => {
    return () => {
      goto(`/${page.params.country}/checkout?stage=${stage}`);
    };
  };

  const onclick = (): void => {
    loading.withLoading(async () => {
      const { url } = await bffClient.checkout.stages.payment.get(page.params.country);
      if (!url) return;
      window.location.assign(url);
    });
  };

  onMount(async () => {
    review = await bffClient.checkout.stages.review.get(page.params.country);
    shippingCost = review.shippingMethod.rate.priceInCents;

    onStageSubmit = onclick;
  });
</script>

{#if review}
  <div class="mb-4 flex flex-col gap-5">
    <ReviewSection
      hasEditButton={review.personalDetails.isEditable}
      onEditButtonClick={generateGoToSectionClick('personal-details')}
      title={checkout.personalDetailsPage.title}
    >
      <p>{checkout.personalDetailsPage.formFields.email.label}: {review.personalDetails.email}</p>
      <p>
        {checkout.personalDetailsPage.fullName}: {review.personalDetails.firstName}
        {review.personalDetails.lastName}
      </p>
    </ReviewSection>
    <ReviewSection
      hasEditButton={review.address.isEditable}
      onEditButtonClick={generateGoToSectionClick('address')}
      title={checkout.addressPage.title}
    >
      <p>{checkout.addressPage.formFields.street.label}: {review.address.street}</p>
      <p>{checkout.addressPage.formFields.postalCode.label}: {review.address.postalCode}</p>
      <p>{checkout.addressPage.formFields.houseNumber.label}: {review.address.houseNumber}</p>
      {#if review.address.apartment}
        <p>{checkout.addressPage.formFields.apartment.label}: {review.address.apartment}</p>
      {/if}
      <p>{checkout.addressPage.formFields.city.label}: {review.address.city}</p>
      {#if review.address.province}
        <p>{checkout.addressPage.formFields.province.label}: {review.address.province}</p>
      {/if}
    </ReviewSection>
    <ReviewSection
      hasEditButton={review.shippingMethod.isEditable}
      onEditButtonClick={generateGoToSectionClick('shipping')}
      title={checkout.shippingMethodPage.title}
    >
      <p>{checkout.shippingMethodPage.shippingCompany}: {review.shippingMethod.name}</p>
      <p>{checkout.shippingMethodPage.deliveryTime}: {review.shippingMethod.rate.deliveryTime} days</p>
      <p class="price">
        {checkout.shippingMethodPage.price}: {formatPrice(
          country.locale,
          country.currency.code,
          review.shippingMethod.rate.priceInCents,
        )}
      </p>
    </ReviewSection>
    <div>
      <div class="mb-2 flex w-full flex-col items-center">
        <h3 style="font-size: 2rem" class="text-center">{checkout.reviewPage.products}</h3>
        <div class="pointer-events-none h-0.5 w-24 bg-white select-none"></div>
      </div>
      <div class="flex flex-col items-center gap-5 xl:overflow-y-auto">
        {#each review.cart.products as product (product.id)}
          <LineItemCard {country} {product} />
        {/each}
      </div>
    </div>
  </div>
{/if}
