<script lang="ts">
  import type { ClassValue } from 'svelte/elements';
  import FlyUpElement from '../FlyUpElement.svelte';

  type Props = {
    children: import('svelte').Snippet;
    class?: ClassValue;
  };

  let { class: className, children }: Props = $props();
</script>

<FlyUpElement class={className} duration={500}>{@render children()}</FlyUpElement>
