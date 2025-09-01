<script lang="ts">
  import { bffClient } from '$service';
  import { goto } from '$app/navigation';
  import { loading } from '$state';
  import { page } from '$app/state';
  import type { PageData } from './$types';
  import type { Product } from '$types';
  import ProductGrid from '../ProductGrid.svelte';
  import { shop } from '$content';

  type Props = {
    data: PageData;
  };

  let { data }: Props = $props();

  let products: Product[] | undefined = $state();

  $effect(() => {
    const search = page.url.searchParams.get('q');
    if (search === null) {
      goto(`/${page.params.country}`, { replaceState: true });
      return;
    } else if (search === '') {
      products = [];
    }

    loading.withLoading(async () => {
      products = await bffClient.products.getBySearch(page.params.country, search);
    });
  });
</script>

<svelte:head><title>{shop.search.headTitle}</title></svelte:head>

<div class="paddings">
  {#if products !== undefined}
    <h1 class="mb-9 text-center text-5xl">{shop.search.title}</h1>

    {#if products.length === 0}
      <p class="text-center">{shop.search.noResults} "{page.url.searchParams.get('q')}"</p>
    {:else}
      <ProductGrid country={data.country} {products} />
    {/if}
  {/if}
</div>
