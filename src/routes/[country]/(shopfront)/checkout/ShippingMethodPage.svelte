<script lang="ts">
  import type { CheckoutStage, Country, ShippingMethod } from '$types';
  import { bffClient } from '$service';
  import { checkout } from '$content';
  import { formatPrice } from '$lib/utils/currency-formatting';
  import { onMount } from 'svelte';
  import { page } from '$app/state';

  type Props = {
    country: Country;
    stages: CheckoutStage[];
    goToNextStage: () => void;
    onStageSubmit: ((e: SubmitEvent) => void) | undefined;
  };

  let { country, stages = $bindable(), goToNextStage, onStageSubmit = $bindable() }: Props = $props();

  let selectedShippingMethodId: string | undefined = $state();
  let shippingMethods: ShippingMethod[] | undefined = $state();

  const onFormSubmit = async (): Promise<void> => {
    if (!selectedShippingMethodId) return;
    const { availableCheckoutStages } = await bffClient.checkout.stages.shipping.set(
      page.params.country,
      selectedShippingMethodId,
    );
    stages = availableCheckoutStages;
    goToNextStage();
  };

  onMount(async () => {
    const { shippingMethods: givenShippingMethods, selectedShippingMethod } =
      await bffClient.checkout.stages.shipping.get(page.params.country);
    shippingMethods = givenShippingMethods;
    if (selectedShippingMethod) selectedShippingMethodId = selectedShippingMethod.id;

    onStageSubmit = onFormSubmit;
  });
</script>

{#snippet shippingMethodCard(shippingMethod: ShippingMethod)}
  {@const id = `shipping-method-${shippingMethod.id}`}
  <input {id} class="hidden" type="radio" value={shippingMethod.id} bind:group={selectedShippingMethodId} />
  <label
    class={[
      'w-44 cursor-pointer border-2 p-4 transition-all',
      selectedShippingMethodId === shippingMethod.id ? 'border-primary' : 'border-white',
    ]}
    for={id}
  >
    <h2 class="truncate">{shippingMethod.name}</h2>
    <p>{checkout.shippingMethodPage.deliveryTime}: {shippingMethod.rate.deliveryTime} days</p>
    <p class="price">
      {checkout.shippingMethodPage.price}: {formatPrice(
        country.locale,
        country.currency.code,
        shippingMethod.rate.priceInCents,
      )}
    </p>
  </label>
{/snippet}

{#if shippingMethods}
  <div class="grid grid-cols-[repeat(auto-fit,minmax(186px,1fr))] justify-center justify-items-center gap-4">
    {#each shippingMethods as shippingMethod (shippingMethod.id)}
      {@render shippingMethodCard(shippingMethod)}
    {/each}
  </div>
{/if}
