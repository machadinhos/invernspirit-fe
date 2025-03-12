<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { config } from '$state';
  import Footer from '$lib/components/layout/footer/Footer.svelte';
  import Header from '$lib/components/layout/header/Header.svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import type { PageData } from './$types';

  type Props = {
    children: import('svelte').Snippet;
    data: PageData;
  };

  let { children, data }: Props = $props();

  let mainComponent: HTMLElement;

  afterNavigate(() => {
    mainComponent.scrollTo(0, 0);
  });

  onMount(() => {
    config.init(page.url.searchParams);
  });
</script>

<div class="fixed inset-0 z-10 flex h-[100dvh] flex-col">
  <Header countries={data.countries} />

  <main bind:this={mainComponent} class="flex-1 overflow-auto">
    {@render children()}
  </main>

  <Footer />
</div>
