<script lang="ts">
  import type { ClassValue, HTMLButtonAttributes } from 'svelte/elements';
  import { ShrinkOnClickWrapper } from '$components';

  type Props = {
    type?: HTMLButtonAttributes['type'];
    class?: ClassValue;
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
    onclick,
    children,
    disabled = false,
    shrinkOnClick = true,
    reverseColors = false,
    ref = $bindable(),
    fullWidth,
  }: Props = $props();
</script>

{#snippet button()}
  <button
    bind:this={ref}
    class={[fullWidth && 'full-width', reverseColors && 'reverse-colors', className]}
    {disabled}
    {onclick}
    {type}
  >
    {@render children()}
  </button>
{/snippet}

{#if !shrinkOnClick}
  {@render button()}
{:else}
  <ShrinkOnClickWrapper>
    {@render button()}
  </ShrinkOnClickWrapper>
{/if}

<style>
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    @media (hover: hover) and (pointer: fine) {
      &:enabled:hover {
        background: var(--color-primary);
        color: var(--color-secondary-dark);
      }
      &.reverse-colors:enabled:hover {
        background: var(--color-secondary-dark);
        color: #fff;
      }
    }
    &,
    &.reverse-colors:enabled:active {
      background: var(--color-secondary-dark);
      color: #fff;
    }
    &:enabled:active,
    &.reverse-colors {
      background: var(--color-primary);
      color: var(--color-secondary-dark);
    }
    &:disabled {
      filter: brightness(1.5);
    }
    &.reverse-colors:disabled {
      filter: brightness(0.5);
    }
  }

  .full-width {
    width: 100%;
  }
</style>
