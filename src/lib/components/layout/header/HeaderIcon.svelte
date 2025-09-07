<script lang="ts">
  import type { HTMLButtonAttributes, MouseEventHandler } from 'svelte/elements';
  import { Icon, type IconSrcType } from '$components-svg-icons';
  import { ShrinkOnClickWrapper } from '$components';

  type ElementType =
    | {
        type: 'div';
      }
    | {
        type: 'button';
        onclick?: MouseEventHandler<HTMLButtonElement>;
      }
    | {
        type: 'anchor';
        href: HTMLAnchorElement['href'];
      };

  type Props = ElementType & {
    src: IconSrcType;
    ref?: HTMLButtonElement | HTMLAnchorElement | HTMLDivElement;
    badge?: string;
    'aria-label': HTMLButtonAttributes['aria-label'] | null;
    size?: number;
  };

  let {
    src,
    type = 'div',
    ref = $bindable(),
    badge,
    'aria-label': ariaLabel,
    size = 24,
    ...restProps
  }: Props = $props();
  const onclick = 'onclick' in restProps ? restProps.onclick : undefined;
  const href = 'href' in restProps ? restProps.href : '';
</script>

{#snippet innerElements()}
  <div class="relative">
    <Icon {size} {src} />
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
      class="outer-element relative grid size-9 place-items-center"
      aria-label={ariaLabel}
      {onclick}
      type="button"
    >
      {@render innerElements()}
    </button>
  {:else if type === 'anchor'}
    <a bind:this={ref} class="outer-element relative grid size-9 place-items-center" aria-label={ariaLabel} {href}>
      {@render innerElements()}
    </a>
  {:else}
    <div bind:this={ref} class="outer-element relative grid size-9 place-items-center">
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
