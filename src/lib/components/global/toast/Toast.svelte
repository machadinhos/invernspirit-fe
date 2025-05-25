<script generics="T extends Record<string, unknown> | undefined" lang="ts">
  import { type Component, onMount } from 'svelte';
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  import { fade, fly } from 'svelte/transition';
  import { FaSolidXmark } from 'svelte-icons-pack/fa';
  import { Icon } from 'svelte-icons-pack';
  import { type Toast } from '$state';

  type Props = {
    toast: Toast<T>;
  };

  let { toast }: Props = $props();

  const Element = toast.element as Component<T & { toast: Toast<T> }, Record<never, never>>;

  const updateProgress = (): void => {
    if (toast.remainingTime === null) return;
    let effectiveRemaining = toast.remainingTime;
    if (toast.timeoutId !== undefined && toast.lastTime !== undefined) {
      effectiveRemaining = toast.remainingTime - (Date.now() - toast.lastTime);
    }
    if (effectiveRemaining < 0) effectiveRemaining = 0;
    toast.progress = (effectiveRemaining / (toast.duration ?? 0)) * 100;
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
  class="toast relative pt-2 pr-2 pb-2 {toast.type === 'normal'
    ? 'bg-background'
    : toast.type === 'error'
      ? 'bg-error'
      : 'bg-success'}"
  aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
  onblur={toast.startTimer}
  onfocus={toast.pauseTimer}
  onmouseenter={toast.pauseTimer}
  onmouseleave={toast.startTimer}
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
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
</style>
