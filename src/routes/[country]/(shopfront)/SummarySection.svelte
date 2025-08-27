<script lang="ts" module>
  let isExpanded = $state(true);

  export const expand = (): void => {
    isExpanded = true;
  };
</script>

<script lang="ts">
  import { cart as cartState, config } from '$state';
  import { browser } from '$app/environment';
  import { Button } from '$components';
  import { cart } from '$content';
  import type { Country } from '$types';
  import { FaSolidChevronUp } from 'svelte-icons-pack/fa';
  import { formatPrice } from '$lib/utils/currency-formatting';
  import { Icon } from 'svelte-icons-pack';
  import { untrack } from 'svelte';

  type Props = {
    country: Country;
    onclick?: () => void;
    buttonText: string;
    buttonType?: HTMLButtonElement['type'];
    buttonDisabled?: boolean;
    additionalCharges?: { name: string; price: number }[];
  };

  let {
    country,
    onclick,
    buttonText,
    buttonType = 'button',
    buttonDisabled = false,
    additionalCharges = [],
  }: Props = $props();
  const id = $props.id();

  let totalPrice = $derived(
    cartState.value.reduce((sum, item) => sum + item.grossPrice * item.quantity, 0) +
      additionalCharges.reduce((sum, item) => sum + item.price, 0),
  );
  let subTotalPrice = $derived(cartState.value.reduce((sum, item) => sum + item.netPrice * item.quantity, 0));
  let taxesPrices = $derived.by((): { name: string; value: number; rate: number }[] => {
    return country.taxes.reduce(
      (taxList, tax) => {
        const name = tax.name;
        const value = cartState.value.reduce(
          (total, lineItem) => total + lineItem.netPrice * lineItem.quantity * tax.rate,
          0,
        );
        const rate = tax.rate;

        taxList.push({ name, value, rate });
        return taxList;
      },
      [] as { name: string; value: number; rate: number }[],
    );
  });

  let dragging = false;
  let startY: number | undefined;
  let expandElement: HTMLDivElement;

  const toggleIsExpanded = (): void => {
    isExpanded = !isExpanded;
  };

  const calculateExtraPricesHeight = (): string => {
    if (!browser) return 'auto';
    const extraPricesElement = document.getElementById(`${id}-extra-prices`);
    return extraPricesElement ? `${extraPricesElement.scrollHeight}px` : 'auto';
  };

  const onpointerdown = (e: PointerEvent): void => {
    if (dragging || e.pointerType !== 'touch') return;
    startY = e.clientY;
    dragging = true;
    expandElement.setPointerCapture(e.pointerId);
  };

  const onpointermove = (e: PointerEvent): void => {
    if (!dragging || startY === undefined) return;
    if (Math.abs(e.clientY - startY) > 10) {
      if (e.clientY < startY) isExpanded = true;
      else if (e.clientY > startY) isExpanded = false;
      if (expandElement.hasPointerCapture(e.pointerId)) expandElement.releasePointerCapture(e.pointerId);
      dragging = false;
    }
  };

  const onpointercancelOrPointerup = (): void => {
    dragging = false;
  };

  $effect(() => {
    additionalCharges = additionalCharges;
    if (!untrack(() => isExpanded)) return;
    const extraPricesElement = document.getElementById(`${id}-extra-prices`);
    if (!extraPricesElement) return;
    extraPricesElement.style.height = 'auto';
    extraPricesElement.style.height = `${extraPricesElement.scrollHeight}px`;
  });
</script>

{#snippet priceLine(text: string, price: number, textSize: 'text-2xl' | 'text-4xl')}
  <div class={['flex place-content-between', textSize]}>
    <span>{text}:</span>
    <span class="price">
      {#if config.isInitialized}
        {formatPrice(country.locale, country.currency.code, price)}
      {:else}
        --.--{country.currency.symbol}
      {/if}
    </span>
  </div>
{/snippet}

<div class="relative flex w-full justify-center bg-secondary p-5">
  <div class="flex w-full flex-col justify-end">
    <div
      bind:this={expandElement}
      class="touch-pan-x"
      onpointercancel={onpointercancelOrPointerup}
      {onpointerdown}
      {onpointermove}
      onpointerup={onpointercancelOrPointerup}
    >
      <div class="absolute inset-0 h-fit w-full md:hidden">
        <button
          class={[
            'flex h-6 w-full items-center justify-center [&>svg]:transition-[rotate] [&>svg]:duration-300',
            isExpanded && '[&>svg]:rotate-180',
          ]}
          onclick={toggleIsExpanded}
          type="button"><Icon src={FaSolidChevronUp} /></button
        >
      </div>
      <div
        id="{id}-extra-prices"
        style="height: {isExpanded ? calculateExtraPricesHeight() : '0px'};"
        class="overflow-clip transition-[height] duration-300"
      >
        {@render priceLine(cart.subtotal, subTotalPrice, 'text-2xl')}
        {#each additionalCharges as { price, name } (name)}
          {@render priceLine(name, price, 'text-2xl')}
        {/each}
        {#each taxesPrices as taxPrice (taxPrice.name)}
          {@render priceLine(`${taxPrice.name} (${taxPrice.rate * 100}%)`, taxPrice.value, 'text-2xl')}
        {/each}
      </div>
    </div>
    <div class="mt-2 w-full">
      <div class="mb-3 space-y-0.5">
        <div class="h-0.5 bg-white"></div>
        {@render priceLine(cart.total, totalPrice, 'text-4xl')}
        <div class="h-0.5 bg-white"></div>
      </div>
      <Button
        class="font-bold"
        disabled={config.isInitialized ? cartState.size < 1 || !cartState.isCheckoutPossible || buttonDisabled : true}
        fullWidth
        {onclick}
        reverseColors
        type={buttonType}>{buttonText}</Button
      >
    </div>
  </div>
</div>
