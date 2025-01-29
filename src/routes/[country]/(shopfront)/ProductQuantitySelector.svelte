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

  const incrementSelectedQuantity = (): void => {
    selectedQuantity++;
  };

  const decrementSelectedQuantity = (): void => {
    selectedQuantity--;
  };
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
  <div class="flex h-full w-4 items-center justify-center">
    <span>{selectedQuantity}</span>
  </div>
  {@render quantityButton('increment')}
</div>
