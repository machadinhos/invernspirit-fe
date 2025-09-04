<script lang="ts">
  import '../app.css';
  import { GlobalModal, ToastGroup } from '$components-global';
  import { GrainyFilter, LoadingScreen } from '$components';
  import { PUBLIC_FE_HOST, PUBLIC_GOOGLE_ANALYTICS_ID } from '$env/static/public';
  import { home } from '$content';
  import { loading } from '$state';
  import { page } from '$app/state';
  import { truncateWithEllipsis } from '$lib/utils/general';

  type Props = {
    children: import('svelte').Snippet;
  };

  let { children }: Props = $props();
</script>

<svelte:head>
  <script async src="https://www.googletagmanager.com/gtag/js?id={PUBLIC_GOOGLE_ANALYTICS_ID}"></script>
  <!-- original code
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  cookieStore.get('cookie_consent').then((c) => {
    const cookieValue = c?.value;
    const hasConsentedToAnalytics = cookieValue && (cookieValue === 'all' || cookieValue.includes('analytics'));
    const gtagConsent = hasConsentedToAnalytics ? 'granted' : 'denied';
    gtag('consent', 'default', {
      ad_storage: gtagConsent,
      analytics_storage: gtagConsent,
    });
  });
  gtag('js', new Date());-->
  <!-- prettier-ignore-->
  <script>
function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],cookieStore.get("cookie_consent").then(a=>{let e=a?.value,t=e&&("all"===e||e.includes("analytics")),n=t?"granted":"denied";gtag("consent","default",{ad_storage:n,analytics_storage:n})}),gtag("js",new Date);
  </script>
  <!-- prettier-ignore-end-->

  {#if !page.data.noCrawl}
    <meta name="robots" content="index,follow" />
  {:else}
    <meta name="robots" content="noindex, nofollow" />
  {/if}

  <meta content={home.headTitle} property="og:site_name" />
  {#if page.data.openGraph}
    <meta content={page.data.openGraph.type} property="og:type" />
    {#if page.data.openGraph.type === 'product.item'}
      <meta content={page.data.openGraph['product:item_group_id']} property="product:item_group_id" />
      <meta content={page.data.openGraph['product:retailer_item_id']} property="product:retailer_item_id" />
      <meta content={page.data.openGraph['product:price:amount']} property="product:price:amount" />
      <meta content={page.data.openGraph['product:price:currency']} property="product:price:currency" />
      <meta content={page.data.openGraph['product:condition']} property="product:condition" />
    {:else if page.data.openGraph.type === 'product.group'}
      <meta content={page.data.openGraph['product:item_group_id']} property="product:item_group_id" />
    {/if}
    <meta content={page.data.openGraph.title} property="og:title" />
    <meta content={truncateWithEllipsis(page.data.openGraph.description, 155)} property="og:description" />
    <meta content={page.data.openGraph.image} property="og:image" />
  {:else}
    <meta content="website" property="og:type" />
    <meta content={home.headTitle} property="og:title" />
    <meta content={truncateWithEllipsis(home.metaDescription, 155)} property="og:description" />
    <meta content="{PUBLIC_FE_HOST}/images/logo-with-background.webp" property="og:image" />
  {/if}
</svelte:head>

{#if loading.isLoading}
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
