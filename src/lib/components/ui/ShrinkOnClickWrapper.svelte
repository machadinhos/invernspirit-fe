<script lang="ts">
  type Props = {
    children: import('svelte').Snippet;
    scaleConfig?: { scaleX: number; scaleY: number } | { scaleXY: number };
  };

  let { children, scaleConfig = { scaleXY: 90 } }: Props = $props();

  if ('scaleXY' in scaleConfig) scaleConfig = { scaleX: scaleConfig.scaleXY, scaleY: scaleConfig.scaleXY };
</script>

<div style={`--scale-x-value: ${scaleConfig.scaleX / 100}; --scale-y-value: ${scaleConfig.scaleY / 100}`}>
  {@render children()}
</div>

<style>
  div {
    display: contents;
  }

  div > :global(*) {
    transition: transform 150ms ease-in-out;

    &:not(:disabled):active {
      transform: scaleX(var(--scale-x-value)) scaleY(var(--scale-y-value));
    }
  }
</style>
