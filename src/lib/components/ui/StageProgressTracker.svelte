<script lang="ts">
  import { onMount } from 'svelte';

  const barSize = 700;
  const stepsSize = 30;

  const steps = ['personal', 'address', 'shipping', 'review', 'payment'];

  let activeStep = $state(0);
  let progress = $derived(Math.min(100, activeStep * (100 / (steps.length - 1))));

  const increment = (): void => {
    if (activeStep > steps.length - 1) return;
    activeStep += 1;
  };

  const decrement = (): void => {
    if (activeStep <= 0) return;
    activeStep -= 1;
  };

  const calculateStepPosition = (index: number): number => {
    const startLeft = -stepsSize / 2;
    const endLeft = barSize - stepsSize / 2;
    const stepLeft = (endLeft - startLeft) / (steps.length - 1);
    return startLeft + stepLeft * index;
  };

  const getStepClass = (index: number): string => {
    if (index === activeStep) return 'selected-step';
    if (index < activeStep) return 'completed-step';
    return 'future-step';
  };

  onMount(() => {
    activeStep = 3;
  });
</script>

<div class="flex h-24 w-full items-center justify-center">
  <div style="width: {barSize}px; height: {stepsSize}px" class="relative flex items-center">
    <div class="relative h-1 w-full">
      <div class="absolute inset-0 h-0.5 w-full bg-[#c8c8c8]"></div>
      <div style="width: {progress}%" class="bg-primary absolute inset-0 h-0.5 w-1/2 transition-all"></div>
    </div>
    {#each steps as step, index (index)}
      <div
        style="left: {calculateStepPosition(index)}px"
        class="{getStepClass(
          index,
        )} absolute top-1/2 aspect-square -translate-y-1/2 rounded-full transition-all duration-500"
      >
        <div style="width: {stepsSize}px; height: {stepsSize}px" class="relative flex items-center justify-center">
          <span class="font-mono text-xl text-white">{index + 1}</span>
          <div class="absolute top-10 left-1/2 -translate-x-1/2 text-white">{step}</div>
        </div>
      </div>
    {/each}
  </div>
</div>

<div class="flex w-full justify-center gap-3">
  <button class="bg-primary h-5 w-5" onclick={decrement} type="button">-</button>
  <button class="bg-primary h-5 w-5" onclick={increment} type="button">+</button>
</div>

<style>
  .selected-step {
    background-color: var(--color-background);
    border-color: var(--color-primary);
    border-width: 2px;
  }

  .completed-step {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    border-width: 2px;
  }

  .future-step {
    background-color: var(--color-background);
    border-color: #c8c8c8;
    border-width: 2px;
  }
</style>
