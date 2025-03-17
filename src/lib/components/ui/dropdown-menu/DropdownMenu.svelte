<script lang="ts">
  import { backIn, backOut } from 'svelte/easing';
  import type { HTMLAttributes } from 'svelte/elements';
  import { onClickOutside } from '$components-actions';
  import { slide } from 'svelte/transition';
  import type { Snippet } from 'svelte';

  type PositionOrFullWidthType = { position: 'left' | 'right' } | { isFullWidth: boolean };

  type Props = PositionOrFullWidthType & {
    class?: HTMLAttributes<HTMLElement>['class'];
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

  const getMenuPositionStyle = (): string => {
    if (isFullWidth) {
      if (!triggerElementRef) return '';
      const top = triggerElementRef.offsetTop + triggerElementRef.offsetHeight + 10;
      return `position: fixed; top: ${top}px; left: 0; width: 100%;`;
    }
    return position === 'left'
      ? 'position: absolute; top: calc(100% + 10px); left: 0;'
      : 'position: absolute; top: calc(100% + 10px); right: 0;';
  };

  let menuPositionStyle = $derived(getMenuPositionStyle());

  const onClickOutsideCallback = (): void => {
    isOpen = false;
  };

  const onClickOutsideIsEnabled = (): boolean => {
    return closeOnOutsideClick && isOpen;
  };

  $effect(() => {
    if (!isOpen) onClose();
  });
</script>

<div bind:this={triggerElementRef} class="relative">
  {@render triggerElement()}
  {#if isOpen}
    <div
      style={menuPositionStyle}
      class="bg-background z-20 shadow-2xl"
      use:onClickOutside={{
        callback: onClickOutsideCallback,
        isEnabled: onClickOutsideIsEnabled,
        otherIncludedElements: [triggerElementRef],
      }}
      transition:slide={{ duration: 800, easing: isOpen ? backOut : backIn }}
    >
      <div class={className}>
        {@render children()}
      </div>
    </div>
  {/if}
</div>
