<script lang="ts">
  import type { Country, Product } from '$types';
  import ProductCard from './ProductCard.svelte';

  type Props = {
    products: Product[];
    country: Country;
  };

  let { products, country }: Props = $props();
</script>

<section class="grid grid-cols-[repeat(auto-fit,minmax(256px,1fr))] justify-center justify-items-center gap-12">
  {#each products as product (product.id)}
    <ProductCard {country} {product} />
  {/each}
</section>
