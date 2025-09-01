<script lang="ts">
  import { page } from '$app/state';
  import type { PageData } from './$types';
  import { shop } from '$content';

  type Props = {
    data: PageData;
  };

  let { data }: Props = $props();
</script>

<svelte:head><title>{shop.collections.headTitle}</title></svelte:head>

<div class="h-full py-14">
  <div class="relative h-full">
    <div class="pointer-events-none z-[1] mb-5 md:absolute md:inset-0 md:mt-5">
      <h1 class="text-center text-5xl">{shop.collections.title}</h1>
    </div>

    <div class="flex gap-4 max-md:flex-col md:h-full md:justify-center md:gap-2">
      {#each data.collections as { id, name, image } (id)}
        <a class="h-36 md:h-auto" href={`/${page.params.country}/shop/collections/${id}`}>
          <div class="relative h-full md:h-full md:w-[200px]">
            <img
              class="size-full object-cover brightness-[30%] grayscale transition-all hover:scale-y-95 hover:brightness-100"
              alt={image.alt}
              src={image.url}
            />
            <div class="pointer-events-none absolute inset-0 flex items-center justify-center text-4xl">
              <h2>{name}</h2>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</div>
