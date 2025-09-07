<script lang="ts">
  import { ArrowReturnLeftIcon, Icon } from '$components-svg-icons';
  import { page } from '$app/state';
  import type { PageData } from './$types';
  import ProductGrid from '../../ProductGrid.svelte';
  import { shop } from '$content';

  type Props = {
    data: PageData;
  };

  let { data }: Props = $props();
</script>

<svelte:head><title>{shop.collections.headTitle}</title></svelte:head>

<div class="paddings flex max-lg:flex-col lg:h-full lg:items-center">
  <div class="flex flex-row-reverse justify-end lg:w-1/2 lg:flex-col lg:pl-40">
    <h1 class="ml-3 text-5xl">{data.collection.name}</h1>
    <div class="mt-5 w-fit">
      <a aria-label="back" href="/{page.params.country}/shop/collections">
        <Icon size="30" src={ArrowReturnLeftIcon} />
      </a>
    </div>
  </div>
  <div class="mt-3 mb-5 h-px bg-white lg:hidden"></div>
  <div class="lg:w-1/2">
    <p class="text-justify">{data.collection.description}</p>
  </div>
</div>

<div class="paddings">
  <ProductGrid country={data.country} products={data.collection.products} />
</div>
