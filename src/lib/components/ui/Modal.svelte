<script lang="ts">
  import type { ClassValue } from 'svelte/elements';
  import { fade } from 'svelte/transition';

  type Props = {
    children: import('svelte').Snippet;
    class?: ClassValue;
    fadeIn?: boolean;
  };

  let { children, class: className, fadeIn }: Props = $props();
</script>

{#if fadeIn}
  <div class={['background backdrop-blur-sm', className]} in:fade|global>
    {@render children()}
  </div>
{:else}
  <div class={['background backdrop-blur-sm', className]}>
    {@render children()}
  </div>
{/if}

<style>
  .background {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background: #0000004d;
    display: grid;
    place-items: center;
    z-index: 45;
  }
</style>
