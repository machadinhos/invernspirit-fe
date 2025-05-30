<script lang="ts">
  import { building } from '$app/environment';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import PageSelection from '$lib/components/ui/paginator/PageSelection.svelte';

  type Props = {
    totalPages: number;
    pageChangeAction?: (page: number) => void;
  };

  let { totalPages, pageChangeAction }: Props = $props();

  const getPageFromSearchParams = (): number => {
    return building ? 1 : Number(page.url.searchParams.get('page') ?? 1);
  };

  let currentPage: number = $derived(getPageFromSearchParams());

  const getPageUrl = (page: number): string => {
    return `?page=${page}`;
  };

  onMount(() => {
    const paramsPage = getPageFromSearchParams();
    if (paramsPage > totalPages) {
      goto(`?page=${totalPages}`, { replaceState: true });
    }
  });
</script>

<PageSelection {currentPage} {getPageUrl} {pageChangeAction} {totalPages} />
