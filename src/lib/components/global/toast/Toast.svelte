<script generics="ToastParams extends Record<string, unknown> | undefined" lang="ts">
  import { type Component, onMount } from 'svelte';
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  import { fade, fly } from 'svelte/transition';
  import { Icon, XMarkIcon } from '$components-svg-icons';
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

  const onpointerdown = (e: PointerEvent): void => {
    if (dragging) return;
    startX = e.clientX;
    currentX = 0;
    outerElement.style.transition = 'none';
    outerElement.setPointerCapture(e.pointerId);
    dragging = true;
    toast.pauseTimer();
  };

  const onpointermove = (e: PointerEvent): void => {
    if (!dragging || startX === undefined) return;
    currentX = e.clientX - startX;
    if (Math.abs(currentX) < 130) {
      outerElement.style.transform = `translateX(${currentX}px)`;
    }
  };

  const onpointerup = (e: PointerEvent): void => {
    if (!dragging) return;
    outerElement.style.transition = '';
    if (Math.abs(currentX) > 65) {
      toast.destroy();
    } else {
      if (e.pointerType === 'mouse' && Math.abs(currentX) <= 1) {
        const target = document.elementFromPoint(e.clientX, e.clientY);
        if (target && target !== outerElement) {
          target.dispatchEvent(new PointerEvent('click', e));
        }
      }
      outerElement.style.transform = '';
      if (e.pointerType === 'touch' && Math.abs(currentX) > 1) {
        toast.startTimer();
      }
    }
    dragging = false;
  };

  const onpointercancel = (e: PointerEvent): void => {
    dragging = false;
    outerElement.style.transition = '';
    outerElement.style.transform = '';
    if (e.pointerType === 'touch') toast.startTimer();
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
    'toast relative touch-pan-y pt-2 pr-2 pb-2 select-none',
    toast.type === 'normal' ? 'bg-background' : toast.type === 'error' ? 'bg-error' : 'bg-success',
  ]}
  aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
  onmouseenter={toast.pauseTimeOnHover ? toast.pauseTimer : undefined}
  onmouseleave={toast.pauseTimeOnHover ? toast.startTimer : undefined}
  {onpointercancel}
  {onpointerdown}
  {onpointermove}
  {onpointerup}
  role={toast.type === 'error' ? 'alert' : 'status'}
  transition:fly|fade={{ y: 50, duration: 500 }}
>
  {#if toast.hasCloseButton}
    <button
      class="absolute top-3 right-3 text-primary"
      aria-label="Close notification"
      onclick={toast.destroy}
      type="button"
    >
      <Icon src={XMarkIcon} />
    </button>
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
