<script lang="ts">
  import { auth } from '$content';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { user } from '$state';

  type Props = {
    children: import('svelte').Snippet;
  };

  let { children }: Props = $props();

  let selected = $derived(page.url.pathname.split('/')[2]);

  onMount(() => {
    if (user.value) goto(`/${page.params.country}`);
  });
</script>

{#snippet pageListItem(href: 'sign-in' | 'sign-up')}
  <li style="font-size: 2.5rem" class="w-1/2 text-center">
    <a
      class="block w-full pt-4 transition-opacity duration-500 {selected === href ? 'opacity-100' : 'opacity-50'}"
      href={`/${page.params.country}/${href}`}
    >
      {#if href === 'sign-in'}
        {auth.signIn.title}
      {:else}
        {auth.signUp.title}
      {/if}
    </a>
  </li>
{/snippet}

<div class="flex h-full w-full justify-center">
  <div
    class="md:bg-background-dark mt-10 flex h-fit w-[95%] flex-col items-center sm:w-[80%] md:w-[65%] md:shadow-2xl lg:w-[50%] xl:w-[40%]"
  >
    <div class="relative w-full pt-10">
      <ul class="flex w-full">
        {@render pageListItem('sign-in')}
        {@render pageListItem('sign-up')}
      </ul>
      <div
        style="left: {selected === 'sign-in' ? '12.5%' : '62.5%'}"
        class="pointer-events-none absolute bottom-0.5 h-0.5 w-[25%] bg-white transition-all duration-500 select-none"
      ></div>
    </div>
    <div class="mt-5 mb-10 w-[75%]">
      {@render children()}
    </div>
  </div>
</div>
