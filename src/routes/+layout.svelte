<script lang="ts">
  import '../app.css';
  import { GlobalModal, ToastGroup } from '$components-global';
  import { GrainyFilter, LoadingScreen } from '$components';
  import { loading } from '$state';
  import { page } from '$app/state';

  type Props = {
    children: import('svelte').Snippet;
  };

  let { children }: Props = $props();
</script>

<svelte:head>
  <!-- Prevent search engine indexing by setting `noCrawl: true` in page/layout load functions (e.g., +page.js, +page.server.js, +layout.js, +layout.server.js) -->
  {#if !page.data.noCrawl}
    <meta name="robots" content="index,follow" />
  {:else}
    <meta name="robots" content="noindex, nofollow" />
  {/if}
</svelte:head>

{#if loading.value}
  <LoadingScreen />
{/if}

<GlobalModal />
<ToastGroup />

<div class="pointer-events-none fixed inset-0 -z-10 select-none">
  <GrainyFilter>
    <div class="bg-background"></div>
  </GrainyFilter>
</div>

{@render children()}
