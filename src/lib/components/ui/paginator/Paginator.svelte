<script lang="ts">
  import PageSelection from './PageSelection.svelte';
  import PaginatorWithSearchParams from './PaginatorWithSearchParams.svelte';

  type PageControl =
    | {
        currentPage: number;
        getPageUrl: (page: number) => string;
        currentPageControlMode: 'custom';
      }
    | {
        currentPageControlMode: 'searchParams';
      };

  type Props = {
    totalPages: number;
    pageChangeAction?: (page: number) => void;
  } & PageControl;

  let { currentPageControlMode = 'searchParams', ...restProps }: Props = $props();
</script>

{#if currentPageControlMode === 'custom' && 'currentPage' in restProps && 'getPageUrl' in restProps}
  <PageSelection {...restProps} />
{:else}
  <PaginatorWithSearchParams {...restProps} />
{/if}
