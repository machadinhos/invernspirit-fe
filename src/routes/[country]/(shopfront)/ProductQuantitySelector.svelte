<script lang="ts">
  import { Button } from '$components';

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

    selectedQuantity = Math.max(Math.min(Number(sanitized), stock), 1);
    inputElementRef.value = String(selectedQuantity);
  };

  $effect(() => {
    quantityInputValue = selectedQuantity;
    inputElementRef.value = String(selectedQuantity);
  });
</script>

{#snippet quantityButton(type: 'increment' | 'decrement')}
  <Button
    class="h-7 w-7 px-0 py-0"
    disabled={type === 'increment' ? !canIncrementSelectedQuantity : !canDecrementSelectedQuantity}
    onclick={type === 'increment' ? incrementSelectedQuantity : decrementSelectedQuantity}
    >{type === 'increment' ? '+' : '-'}</Button
  >
{/snippet}

<div class="flex">
  {@render quantityButton('decrement')}
  <div class="flex h-full w-7 items-center justify-center">
    <input
      bind:this={inputElementRef}
      name="quantity"
      class="w-7 text-center focus:outline-hidden"
      aria-label="quantity"
      disabled={disabled || (!canDecrementSelectedQuantity && !canIncrementSelectedQuantity)}
      max={stock}
      min={allowZero ? 0 : 1}
      {onblur}
      type="number"
      bind:value={quantityInputValue}
    />
  </div>
  {@render quantityButton('increment')}
</div>

<style>
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
