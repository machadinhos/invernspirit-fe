<script generics="T" lang="ts">
  import { onClickOutside } from '$components-actions';
  import type { Snippet } from 'svelte';

  type Props = {
    triggerElement: Snippet;
    optionSnippet: Snippet<[T, number]>;
    options: T[];
    selected: number;
    isOpen: boolean;
  };

  let { triggerElement, optionSnippet, options, selected = $bindable(), isOpen = $bindable() }: Props = $props();

  const toggleOpen = (): void => {
    isOpen = !isOpen;
  };

  const closeSelect = (): void => {
    isOpen = false;
  };

  const getSelectOptionCallback = (index: number) => {
    return (): void => {
      selected = index;
    };
  };
</script>

<div class="relative">
  <button
    class="bg-background flex cursor-pointer items-center gap-1"
    class:open={isOpen}
    onclick={toggleOpen}
    type="button"
  >
    {@render triggerElement()}
  </button>
  {#if isOpen}
    <div
      class="absolute top-full flex flex-col rounded-xs"
      use:onClickOutside={{ callback: closeSelect, enabled: isOpen, ignoreFirstClick: true }}
    >
      {#each options as option, index (index)}
        <button onclick={getSelectOptionCallback(index)} type="button">
          {@render optionSnippet(option, index)}
        </button>
      {/each}
    </div>
  {/if}
</div>
