<script lang="ts">
  import { Button } from '$components';

  type Props = {
    currentPage: number;
    getPageUrl: (page: number) => string;
    totalPages: number;
    pageChangeAction?: (page: number) => void;
  };

  let { currentPage, getPageUrl, totalPages, pageChangeAction }: Props = $props();

  let pagesToShow = $derived(
    ((): number[] => {
      if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const pages = [1];

      if (currentPage <= 3) {
        pages.push(2, 3, 4);
      } else if (currentPage >= totalPages - 2) {
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }

      pages.push(totalPages);

      return pages;
    })(),
  );

  $effect(() => {
    pageChangeAction?.(currentPage);
  });
</script>

{#snippet pageAnchor(page: number)}
  {@const isActive = currentPage === page}
  <a href={getPageUrl(page)}>
    <Button class="h-8 w-8 px-0 py-0 font-mono" disabled={isActive} reverseColors={isActive}>{page}</Button>
  </a>
{/snippet}

<div class="flex gap-2">
  {#if currentPage > 1}
    <a href={getPageUrl(currentPage - 1)}>
      <Button class="h-8 w-8 px-0 py-0 font-mono">&lt;</Button>
    </a>
  {/if}
  <div class="flex">
    {#each pagesToShow as page, index (page)}
      {@render pageAnchor(page)}
      {#if (pagesToShow.at(index + 1) ?? page) - page > 1}
        <span>...</span>
      {/if}
    {/each}
  </div>
  {#if currentPage < totalPages}
    <a href={getPageUrl(currentPage + 1)}>
      <Button class="h-8 w-8 px-0 py-0 font-mono">&gt;</Button>
    </a>
  {/if}
</div>
