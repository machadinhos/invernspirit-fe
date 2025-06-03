<script lang="ts">
  import { fly, type FlyParams } from 'svelte/transition';
  import type { ClassValue } from 'svelte/elements';
  import { quintInOut } from 'svelte/easing';

  type Props = {
    children: import('svelte').Snippet;
    class?: ClassValue;
    duration: FlyParams['duration'];
  };

  let { class: classNames, children, duration }: Props = $props();
</script>

<div class="overflow-hidden">
  <div
    class={['w-fit', classNames]}
    transition:fly|global={{
      duration: duration,
      y: 50,
      easing: quintInOut,
    }}
  >
    {@render children()}
  </div>
</div>
