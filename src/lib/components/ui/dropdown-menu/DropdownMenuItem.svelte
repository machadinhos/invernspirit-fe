<script lang="ts">
  import FlyUpElement from '../FlyUpElement.svelte';

  type Props = {
    children: import('svelte').Snippet;
    class?: HTMLElement['className'];
  };

  let { class: className, children }: Props = $props();
</script>

<FlyUpElement class={className} duration={500}>{@render children()}</FlyUpElement>
