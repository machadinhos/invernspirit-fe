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

  const onkeydown = (e: KeyboardEvent): void => {
    const element = e.target as HTMLInputElement;
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        const prevInput = element.parentElement?.previousElementSibling?.childNodes[0];
        if (prevInput && prevInput instanceof HTMLInputElement) {
          e.preventDefault();
          prevInput.focus();
        }
      } else {
        const nextInput = element.parentElement?.nextElementSibling?.childNodes[0];
        if (nextInput && nextInput instanceof HTMLInputElement) {
          e.preventDefault();
          nextInput.focus();
        }
      }
    }
  };

  onMount(async () => {
    const { shippingMethods: givenShippingMethods, selectedShippingMethod } =
      await bffClient.checkout.stages.shipping.get(page.params.country);
    shippingMethods = givenShippingMethods;
    if (selectedShippingMethod) selectedShippingMethodId = selectedShippingMethod.id;

    onStageSubmit = onFormSubmit;
  });
</script>

{#if shippingMethods}
  <div class="grid grid-cols-[repeat(auto-fit,minmax(186px,1fr))] justify-center justify-items-center gap-4">
    {#each shippingMethods as shippingMethod (shippingMethod.id)}
      <label class="bg-background w-44 cursor-pointer p-4">
        <input
          class="sr-only"
          {onkeydown}
          type="radio"
          value={shippingMethod.id}
          bind:group={selectedShippingMethodId}
        />
        <div class="mb-2 flex w-full justify-center">
          <div
            class={[
              "bg-background-dark after:bg-primary flex h-4 w-4 items-center justify-center rounded-full after:h-2 after:w-2 after:rounded-full after:transition-opacity after:content-['']",
              shippingMethod.id === selectedShippingMethodId ? 'after:opacity-100' : 'after:opacity-0',
            ]}
          ></div>
        </div>
        <h2 class="truncate">{shippingMethod.name}</h2>
        <p>{checkout.shippingMethodPage.deliveryTime}: {shippingMethod.rate.deliveryTime} days</p>
        <p class="price">
          {checkout.shippingMethodPage.price}:}: {formatPrice(
            country.locale,
            country.currency.code,
            shippingMethod.rate.priceInCents,
          )}
          }
        </p>
      </label>
    {/each}
  </div>{/if}

<style>
  label {
    transition: box-shadow 150ms ease-in-out;
  }

  label:has(input:checked) {
    box-shadow: 0 0 0 1px var(--color-primary);
  }

  label:has(input:not(:checked):focus-visible) {
    box-shadow: 0 0 0 1px white;
  }
</style>
