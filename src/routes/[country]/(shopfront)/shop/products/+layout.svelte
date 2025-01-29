<script lang="ts">
  type Props = {
    children: import('svelte').Snippet;
  };

  let { children }: Props = $props();
</script>

<div class="paddings">
  {@render children()}
</div>
