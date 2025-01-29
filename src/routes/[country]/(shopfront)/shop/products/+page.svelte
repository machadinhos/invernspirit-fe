<script lang="ts">
  import type { PageData } from './$types';
  import ProductGrid from '../ProductGrid.svelte';
  import { shop } from '$content';

  type Props = {
    data: PageData;
  };

  let { data }: Props = $props();
</script>

<svelte:head><title>{shop.products.headTitle}</title></svelte:head>

<h1 class="mb-9 text-center text-5xl">{shop.products.title}</h1>

<ProductGrid country={data.country} products={data.products} />
