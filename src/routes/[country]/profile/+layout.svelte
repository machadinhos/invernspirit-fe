<script lang="ts">
  import { config, user } from '$state';
  import { FaAddressCard, FaSolidReceipt } from 'svelte-icons-pack/fa';
  import { Icon, type IconType } from 'svelte-icons-pack';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { profile } from '$content';

  type Props = {
    children: import('svelte').Snippet;
  };

  let { children }: Props = $props();

  let selected = $derived(page.url.pathname.split('/')[3]);

  onMount(() => {
    config.afterInitialization(() => {
      if (!user.isLoggedIn) goto(`/${page.params.country}`);
    });
  });
</script>

<svelte:head><title>{profile.headTitle}</title></svelte:head>

{#snippet listItem(subPage: string, text: string, icon: IconType)}
  <li class={subPage === selected ? 'bg-background' : 'opacity-50'}>
    <a class="flex w-full items-center gap-2 px-3 py-1" href="/{page.params.country}/profile/{subPage}">
      <Icon src={icon} />
      {text}</a
    >
  </li>
{/snippet}

<div class="flex h-full w-full flex-col items-center">
  <h1 class="mb-9 text-center text-5xl">{profile.title}</h1>
  <div class="flex w-[90%] flex-col gap-5 md:max-w-[900px] md:flex-row">
    <ul class="flex flex-col gap-2 md:w-44">
      {@render listItem('user-details', profile.links.userDetails, FaAddressCard)}
      {@render listItem('orders', profile.links.orders, FaSolidReceipt)}
    </ul>
    <div class="w-full">
      {@render children()}
    </div>
  </div>
</div>
