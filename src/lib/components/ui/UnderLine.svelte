<script lang="ts">
  import type { ClassValue } from 'svelte/elements';

  type Props = {
    children: import('svelte').Snippet;
    widthPercent?: number;
    class?: ClassValue;
  };

  let { children, widthPercent = 75, class: className }: Props = $props();
</script>

<span style="--width-percent: {widthPercent}%" class={['underline-class', className]}>
  {@render children()}
</span>

<style>
  .underline-class {
    position: relative;
  }

  .underline-class::after {
    content: '';
    pointer-events: none;
    background: white;
    position: absolute;
    left: 50%;
    bottom: -0.25rem;
    width: var(--width-percent);
    height: 2px;
    transform: translateX(-50%);
    border-radius: 1px;
  }
</style>
