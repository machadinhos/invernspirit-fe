<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { ShrinkOnClickWrapper } from '$components';

  type Props = {
    type?: HTMLButtonAttributes['type'];
    class?: HTMLButtonAttributes['class'];
    onclick?: (event: Event) => void;
    children: import('svelte').Snippet;
    disabled?: boolean;
    shrinkOnClick?: boolean;
    reverseColors?: boolean;
    ref?: HTMLButtonElement;
    fullWidth?: boolean;
  };

  let {
    type = 'button',
    class: className,
    onclick = (): void => undefined,
    children,
    disabled = false,
    shrinkOnClick = true,
    reverseColors = false,
    ref = $bindable(),
    fullWidth,
  }: Props = $props();

  const finalOnclick = (event: Event): void => {
    if (disabled) return;
    onclick(event);
  };
</script>

{#snippet button()}
  <button
    bind:this={ref}
    class="{reverseColors
      ? 'bg-primary enabled:hover:bg-secondary-dark enabled:active:bg-secondary-dark text-secondary-dark enabled:hover:text-white enabled:active:text-white disabled:brightness-50'
      : 'bg-secondary-dark enabled:hover:bg-primary enabled:active:bg-primary enabled:hover:text-secondary-dark enabled:active:text-secondary-dark disabled:brightness-150'} flex items-center justify-center px-2 py-2 {fullWidth
      ? 'w-full'
      : 'w-fit'} {className}"
    {disabled}
    onclick={finalOnclick}
    {type}
  >
    {@render children()}
  </button>
{/snippet}

{#if !shrinkOnClick}
  {@render button()}
{:else}
  <ShrinkOnClickWrapper {disabled} {fullWidth}>
    {@render button()}
  </ShrinkOnClickWrapper>
{/if}
