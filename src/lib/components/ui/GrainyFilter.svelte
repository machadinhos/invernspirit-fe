<script lang="ts">
  type Props = {
    children?: import('svelte').Snippet;
  };

  let { children }: Props = $props();
</script>

<div>
  {@render children?.()}
  <div style="background-image: url('/grainy-bg-image.webp')" class="absolute inset-0"></div>
</div>
