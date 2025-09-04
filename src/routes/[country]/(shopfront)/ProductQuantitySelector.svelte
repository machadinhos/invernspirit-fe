<script lang="ts">
  import { Button } from '$components';
  import { clamp } from '$lib/utils/general';

  type Props = {
    stock: number;
    selectedQuantity: number;
    disabled?: boolean;
    allowZero?: boolean;
  };

  let { stock, selectedQuantity = $bindable(), disabled, allowZero }: Props = $props();

  let canIncrementSelectedQuantity = $derived(!disabled && selectedQuantity < stock);
  let canDecrementSelectedQuantity = $derived(!disabled && selectedQuantity > (allowZero ? 0 : 1));
  let quantityInputValue = $state(selectedQuantity);

  let inputElementRef: HTMLInputElement;

  const incrementSelectedQuantity = (): void => {
    selectedQuantity++;
  };

  const decrementSelectedQuantity = (): void => {
    selectedQuantity--;
  };

  const onblur = (): void => {
    const currentValue = inputElementRef.value;
    const sanitized = currentValue.replace(/\D/g, '');

    selectedQuantity = clamp(Number(sanitized), 1, stock);
    inputElementRef.value = String(selectedQuantity);
  };

  $effect(() => {
    quantityInputValue = selectedQuantity;
    inputElementRef.value = String(selectedQuantity);
  });
</script>

{#snippet quantityButton(type: 'increment' | 'decrement')}
  <Button
    class="size-7"
    disabled={type === 'increment' ? !canIncrementSelectedQuantity : !canDecrementSelectedQuantity}
    onclick={type === 'increment' ? incrementSelectedQuantity : decrementSelectedQuantity}
    >{type === 'increment' ? '+' : '-'}</Button
  >
{/snippet}

<div class="flex">
  {@render quantityButton('decrement')}
  <input
    bind:this={inputElementRef}
    name="quantity"
    class="w-7 text-center"
    aria-label="quantity"
    disabled={disabled || (!canDecrementSelectedQuantity && !canIncrementSelectedQuantity)}
    inputmode="numeric"
    max={stock}
    min={allowZero ? 0 : 1}
    {onblur}
    type="number"
    bind:value={quantityInputValue}
  />
  {@render quantityButton('increment')}
</div>

<style>
  input {
    appearance: textfield;
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
</style>
