<script lang="ts">
  import { backIn, backOut } from 'svelte/easing';
  import type { ClassValue } from 'svelte/elements';
  import { on } from 'svelte/events';
  import { onClickOutside } from '$components-attachments';
  import { slide } from 'svelte/transition';
  import type { Snippet } from 'svelte';

  type PositionOrFullWidthType = { position: 'left' | 'right' } | { isFullWidth: boolean };

  type Props = PositionOrFullWidthType & {
    class?: ClassValue;
    isOpen: boolean;
    onClose?: () => void;
    triggerElement: Snippet;
    closeOnOutsideClick?: boolean;
    children: Snippet;
  };

  let {
    class: className,
    isOpen = $bindable(),
    onClose = (): void => undefined,
    triggerElement,
    closeOnOutsideClick = true,
    children,
    ...restProps
  }: Props = $props();

  let triggerElementRef: HTMLElement | undefined = $state();

  const isFullWidth = 'isFullWidth' in restProps ? restProps.isFullWidth : undefined;
  const position = 'position' in restProps ? restProps.position : undefined;

  let menuPositionStyle = $derived.by((): string => {
    if (isFullWidth) {
      if (!triggerElementRef) return '';
      const top = triggerElementRef.offsetTop + triggerElementRef.offsetHeight + 10;
      return `position: fixed; top: ${top}px; left: 0; width: 100%;`;
    }
    return position === 'left'
      ? 'position: absolute; top: calc(100% + 10px); left: 0;'
      : 'position: absolute; top: calc(100% + 10px); right: 0;';
  });

  const onClickOutsideCallback = (): void => {
    isOpen = false;
  };

  $effect(() => {
    if (!isOpen) onClose();
  });

  $effect(() => {
    if (!isOpen) return;
    return on(document, 'keydown', (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        isOpen = false;
      }
    });
  });
</script>

<div
  bind:this={triggerElementRef}
  class="relative"
  {@attach onClickOutside({
    callback: onClickOutsideCallback,
    isEnabled: closeOnOutsideClick && isOpen,
  })}
>
  {@render triggerElement()}
  {#if isOpen}
    <div
      style={menuPositionStyle}
      class="z-20 bg-background shadow-2xl"
      transition:slide={{ duration: 800, easing: isOpen ? backOut : backIn }}
    >
      <div class={className}>
        {@render children()}
      </div>
    </div>
  {/if}
</div>
