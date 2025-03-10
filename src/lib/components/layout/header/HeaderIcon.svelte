<script lang="ts">
  import { Icon, type IconType } from 'svelte-icons-pack';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { ShrinkOnClickWrapper } from '$components';

  type Props = {
    src: IconType;
    type?: 'button' | 'div';
    onclick?: () => void;
    ref?: HTMLButtonElement;
    badge?: string;
    'aria-label': HTMLButtonAttributes['aria-label'] | null;
    size?: number;
  };

  let {
    src,
    onclick = (): void => undefined,
    type = 'button',
    ref = $bindable(),
    badge,
    'aria-label': ariaLabel,
    size = 20,
  }: Props = $props();
</script>

{#snippet innerElements()}
  <div class="relative">
    <span class="flex items-center justify-center">
      <Icon color="white" {size} {src} />
    </span>
    {#if badge}
      <span class="absolute -top-4 -right-2 text-lg font-bold">
        {badge}
      </span>
    {/if}
  </div>
{/snippet}

<ShrinkOnClickWrapper>
  {#if type === 'button'}
    <button
      bind:this={ref}
      class="outer-element relative flex h-9 w-9 cursor-pointer items-center justify-center"
      aria-label={ariaLabel}
      {onclick}
      type="button"
    >
      {@render innerElements()}
    </button>
  {:else}
    <div class="outer-element relative flex h-9 w-9 cursor-pointer items-center justify-center">
      {@render innerElements()}
    </div>
  {/if}
</ShrinkOnClickWrapper>

<style>
  .outer-element > div {
    transition: all 300ms ease-in-out;
  }
  @media (hover: hover) and (pointer: fine) {
    .outer-element:hover > div {
      transform: scale(1.75);
      transform-origin: center;
    }
  }
</style>
