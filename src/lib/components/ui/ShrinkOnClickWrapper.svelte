<script lang="ts">
  type Props = {
    children: import('svelte').Snippet;
    scaleConfig?: { scaleX: number; scaleY: number } | { scaleXY: number };
    disabled?: boolean;
  };

  let { children, scaleConfig = { scaleXY: 90 }, disabled = false }: Props = $props();

  if ('scaleXY' in scaleConfig) scaleConfig = { scaleX: scaleConfig.scaleXY, scaleY: scaleConfig.scaleXY };
</script>

<div
  style={`--scale-x-value: ${scaleConfig.scaleX / 100}; --scale-y-value: ${scaleConfig.scaleY / 100}`}
  class="shrinking-element transition-all"
  class:disabled
>
  {@render children()}
</div>

<style>
  .shrinking-element:active {
    transform: scaleX(var(--scale-x-value)) scaleY(var(--scale-y-value));
  }

  .shrinking-element.disabled:active {
    transform: none;
  }
</style>
