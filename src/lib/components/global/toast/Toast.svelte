<script lang="ts">
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  import { fade, fly } from 'svelte/transition';
  import { FaSolidX } from 'svelte-icons-pack/fa';
  import { Icon } from 'svelte-icons-pack';
  import { onMount } from 'svelte';
  import { type Toast } from '$state';

  type Props = {
    toast: Toast<unknown>;
  };

  let { toast }: Props = $props();

  let remainingTime = $state(toast.duration);
  let timeoutId: ReturnType<typeof setTimeout> | undefined = $state();
  let lastTime: number | undefined = $state();
  let intervalId: ReturnType<typeof setInterval> | undefined = $state();
  let progress = $state(100);

  const startTimer = (): void => {
    if (remainingTime === null) return;
    lastTime = Date.now();
    timeoutId = setTimeout(() => {
      toast.destroy();
    }, remainingTime);
  };

  const pauseTimer = (): void => {
    if (remainingTime === null) return;
    if (timeoutId !== undefined && lastTime !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
      const elapsed = Date.now() - lastTime;
      remainingTime -= elapsed;
    }
  };

  const updateProgress = (): void => {
    if (remainingTime === null) return;
    let effectiveRemaining = remainingTime;
    if (timeoutId !== undefined && lastTime !== undefined) {
      effectiveRemaining = remainingTime - (Date.now() - lastTime);
    }
    if (effectiveRemaining < 0) effectiveRemaining = 0;
    progress = (effectiveRemaining / (toast.duration ?? 0)) * 100;
  };

  onMount(() => {
    if (toast.duration === null) return;
    startTimer();
    intervalId = setInterval(updateProgress, 50);
    return (): void => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      if (intervalId !== undefined) clearInterval(intervalId);
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
  onblur={startTimer}
  onfocus={pauseTimer}
  onmouseenter={pauseTimer}
  onmouseleave={startTimer}
  role={toast.type === 'error' ? 'alert' : 'status'}
  transition:fly|fade={{ y: 50, duration: 500 }}
>
  {#if toast.hasCloseButton}
    <button
      class="text-primary absolute top-3 right-3"
      aria-label="Close notification"
      onclick={toast.destroy}
      type="button"><Icon src={FaSolidX} /></button
    >
  {/if}
  <div class="pr-6 pl-6 whitespace-nowrap">
    {@render toast.element(toast, toast.extraParams)}
  </div>
  {#if toast.hasRemainingTimeLine && toast.duration !== null}
    <div class="mx-2 mt-2.5 h-1">
      <div style="width: {progress}%" class="h-full bg-white transition-[width] duration-[50ms]"></div>
    </div>
  {/if}
</div>

<style>
  .toast {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
</style>
