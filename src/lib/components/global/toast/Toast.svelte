<script generics="ToastParams extends Record<string, unknown> | undefined" lang="ts">
  import { type Component, onMount } from 'svelte';
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  import { fade, fly } from 'svelte/transition';
  import type { Attachment } from 'svelte/attachments';
  import { FaSolidXmark } from 'svelte-icons-pack/fa';
  import { Icon } from 'svelte-icons-pack';
  import { on } from 'svelte/events';
  import { type Toast } from '$state';

  type Props = {
    toast: Toast<ToastParams>;
  };

  let { toast }: Props = $props();

  const Element = toast.element as Component<ToastParams & { toast: Toast<ToastParams> }, Record<never, never>>;
  let outerElement: HTMLDivElement;
  let dragging = false;
  let startX: number | undefined;
  let currentX = 0;

  const updateProgress = (): void => {
    if (toast.remainingTime === null) return;
    let effectiveRemaining = toast.remainingTime;
    if (toast.timeoutId !== undefined && toast.lastTime !== undefined) {
      effectiveRemaining = toast.remainingTime - (Date.now() - toast.lastTime);
    }
    if (effectiveRemaining < 0) effectiveRemaining = 0;
    toast.progress = (effectiveRemaining / (toast.duration ?? 0)) * 100;
  };

  const getClientX = (e: MouseEvent | TouchEvent): number => {
    return 'clientX' in e ? e.clientX : e.touches[0].clientX;
  };

  const startDrag = (e: MouseEvent | TouchEvent): void => {
    startX = getClientX(e);
    dragging = true;
    outerElement.style.transition = 'none';
    toast.pauseTimer();
  };

  const dragMove = (e: MouseEvent | TouchEvent): void => {
    if (!dragging || startX === undefined) return;
    currentX = getClientX(e) - startX;
    if (Math.abs(currentX) < 130) {
      outerElement.style.transform = `translateX(${currentX}px)`;
    }
  };

  const endDrag = (e: MouseEvent | TouchEvent): void => {
    dragging = false;
    outerElement.style.transition = '';
    if (Math.abs(currentX) > 65) {
      toast.destroy();
    } else {
      outerElement.style.transform = '';
      if ('touches' in e && Math.abs(currentX) > 1) {
        toast.startTimer();
      }
      currentX = 0;
    }
  };

  const onpointerdown = (e: PointerEvent): void => {
    outerElement.setPointerCapture(e.pointerId);
  };

  const onpointerup = (e: PointerEvent): void => {
    outerElement.releasePointerCapture(e.pointerId);
    if (Math.abs(currentX) <= 1) {
      const clickedElement = document.elementFromPoint(e.clientX, e.clientY);
      if (clickedElement && clickedElement !== outerElement) {
        clickedElement.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          }),
        );
      }
    }
  };

  const attach: Attachment<HTMLDivElement> = (node: HTMLDivElement) => {
    const touchstartCleanup = on<HTMLDivElement, 'touchstart'>(node, 'touchstart', startDrag, { passive: false });
    const touchmoveCleanup = on<HTMLDivElement, 'touchmove'>(node, 'touchmove', dragMove, { passive: false });
    const touchendCleanup = on<HTMLDivElement, 'touchend'>(node, 'touchend', endDrag, { passive: false });

    return (): void => {
      touchstartCleanup();
      touchmoveCleanup();
      touchendCleanup();
    };
  };

  onMount(() => {
    if (toast.duration === null) return;
    toast.startTimer();
    toast.intervalId = setInterval(updateProgress, 50);
    return (): void => {
      if (toast.timeoutId !== undefined) clearTimeout(toast.timeoutId);
      if (toast.intervalId !== undefined) clearInterval(toast.intervalId);
    };
  });
</script>

<div
  bind:this={outerElement}
  class={[
    'toast relative pt-2 pr-2 pb-2 select-none',
    toast.type === 'normal' ? 'bg-background' : toast.type === 'error' ? 'bg-error' : 'bg-success',
  ]}
  {@attach attach}
  aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
  onmousedown={startDrag}
  onmouseenter={toast.pauseTimeOnHover ? toast.pauseTimer : undefined}
  onmouseleave={toast.pauseTimeOnHover ? toast.startTimer : undefined}
  onmousemove={dragMove}
  onmouseup={endDrag}
  {onpointerdown}
  {onpointerup}
  role={toast.type === 'error' ? 'alert' : 'status'}
  transition:fly|fade={{ y: 50, duration: 500 }}
>
  {#if toast.hasCloseButton}
    <button
      class="text-primary absolute top-3 right-3"
      aria-label="Close notification"
      onclick={toast.destroy}
      type="button"><Icon src={FaSolidXmark} /></button
    >
  {/if}
  <div class="pr-6 pl-6">
    <Element {...toast.extraParams} {toast} />
  </div>
  {#if toast.hasRemainingTimeLine && toast.duration !== null}
    <div class="mx-2 mt-2.5 h-1">
      <div style="width: {toast.progress}%" class="h-full bg-white transition-[width] duration-[50ms]"></div>
    </div>
  {/if}
</div>

<style>
  .toast {
    transition: transform 150ms ease-in-out;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
</style>
