<script generics="T" lang="ts">
  import { type Snippet } from 'svelte';

  type Props = {
    separator: Snippet;
    breadCrumbSnippet: Snippet<[T]>;
    breadCrumbs: T[];
    'aria-label': string;
  };

  let { separator, breadCrumbSnippet, breadCrumbs, 'aria-label': ariaLabel }: Props = $props();
</script>

<nav aria-label={ariaLabel}>
  <ul class="flex items-center gap-2">
    {#each breadCrumbs as breadCrumb, index (index)}
      <li>
        {@render breadCrumbSnippet(breadCrumb)}
      </li>
      {#if index !== breadCrumbs.length - 1}
        {@render separator()}
      {/if}
    {/each}
  </ul>
</nav>
