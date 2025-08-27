<script lang="ts">
  type Props = {
    children: import('svelte').Snippet;
  };

  let { children }: Props = $props();
</script>

<li data-test="outer">
  <span class="list-item-class">
    {@render children()}
  </span>
</li>

<style>
  .list-item-class {
    display: inline;
    position: relative;
  }

  .list-item-class::after {
    pointer-events: none;
    content: '';
    position: absolute;
    left: 50%;
    bottom: -0.25rem;
    width: 100%;
    height: 2px;
    background: white;
    transform: translateX(-50%) scaleX(0);
    transform-origin: center;
    transition: transform 300ms ease-in-out;
  }

  @media (hover: hover) and (pointer: fine) {
    .list-item-class:hover::after {
      transform: translateX(-50%) scaleX(1);
    }
  }
</style>
