<script lang="ts">
  import { Drawer, DrawerItem } from '$components';
  import { capitalize } from '$lib/utils/general';
  import { common } from '$content';
  import type { Country } from '$types';
  import CountrySelector from '$lib/components/layout/header/CountrySelector.svelte';
  import HeaderIcon from '$lib/components/layout/header/HeaderIcon.svelte';
  import MediaButtonsSection from './MediaButtonsSection.svelte';
  import { MenuIcon } from '$components-svg-icons';
  import Newsletter from './Newsletter.svelte';
  import { page } from '$app/state';

  type Props = {
    countries: Country[];
  };

  let { countries }: Props = $props();

  let isOpen = $state(false);

  const toggleDrawer = (): void => {
    isOpen = !isOpen;
  };
</script>

{#snippet icons()}
  <Newsletter />
  <div class="h-9 w-0.5 shrink-0 bg-white"></div>
  <MediaButtonsSection />
{/snippet}

{#snippet drawerItem(text: string, type: 'main' | 'secondary', href?: string)}
  {#snippet drawerTextComponent(text: string, type: 'main' | 'secondary')}
    {#if type === 'main'}
      <h2 class="text-4xl">{capitalize(text)}</h2>
    {:else}
      <h3 class="pl-7 text-2xl">{capitalize(text)}</h3>
    {/if}
  {/snippet}

  {#if href}
    <a {href} onclick={toggleDrawer}>
      {@render drawerTextComponent(text, type)}
    </a>
  {:else}
    {@render drawerTextComponent(text, type)}
  {/if}
{/snippet}

<div class="mt-8 flex w-20 items-center xl:w-52">
  <div class=" hidden gap-4 xl:flex">
    {@render icons()}
  </div>
  <div class="xl:hidden">
    <div class="flex items-center gap-1">
      <HeaderIcon aria-label="menu" onclick={toggleDrawer} size={25} src={MenuIcon} type="button" />
      <CountrySelector {countries} />
    </div>
    <Drawer bind:isOpen>
      <div class="mt-5 flex gap-4">
        {@render icons()}
      </div>
      <div class="flex h-[90%] w-full items-center justify-center">
        <div class="space-y-2">
          <div>
            <DrawerItem>{@render drawerItem(common.header.pages.shop.title, 'main')}</DrawerItem>
            <DrawerItem
              >{@render drawerItem(
                common.header.pages.shop.byCollection,
                'secondary',
                `/${page.params.country}/shop/collections`,
              )}</DrawerItem
            >
            <DrawerItem
              >{@render drawerItem(
                common.header.pages.shop.byProduct,
                'secondary',
                `/${page.params.country}/shop/products`,
              )}</DrawerItem
            >
          </div>
          <DrawerItem
            >{@render drawerItem(common.header.pages.about, 'main', `/${page.params.country}/about`)}</DrawerItem
          >
          <DrawerItem
            >{@render drawerItem(common.header.pages.contact, 'main', `/${page.params.country}/contact`)}</DrawerItem
          >
          <DrawerItem>{@render drawerItem(common.header.pages.faq, 'main', `/${page.params.country}/faq`)}</DrawerItem>
        </div>
      </div>
    </Drawer>
  </div>
</div>
