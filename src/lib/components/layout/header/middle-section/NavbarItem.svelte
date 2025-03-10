<script lang="ts">
  type Props = {
    children: import('svelte').Snippet;
  };

  let { children }: Props = $props();
</script>

<li>
  <span class="list-item-class">
    {@render children()}
  </span>
  <div class="flex justify-center">
    <div class="underline-class h-0.5 w-0 bg-white"></div>
  </div>
</li>

<style>
  .underline-class {
    transition: width 300ms ease-in-out;
  }

  @media (hover: hover) and (pointer: fine) {
    .list-item-class:hover ~ div > .underline-class {
      width: 100%;
    }
  }
</style>
