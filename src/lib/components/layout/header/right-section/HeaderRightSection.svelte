<script lang="ts">
  import { BiSolidCart } from 'svelte-icons-pack/bi';
  import { cart } from '$state';
  import { common } from '$content';
  import type { Country } from '$types';
  import CountrySelector from '$lib/components/layout/header/CountrySelector.svelte';
  import HeaderIcon from '../HeaderIcon.svelte';
  import { page } from '$app/state';
  import UserButton from '$lib/components/layout/header/right-section/UserButton.svelte';

  type Props = {
    countries: Country[];
  };

  let { countries }: Props = $props();
</script>

<div class="mt-8 flex w-20 items-center justify-end gap-4 xl:w-52">
  <div class="hidden xl:block">
    <CountrySelector {countries} />
  </div>
  <UserButton />
  <HeaderIcon
    aria-label={common.header.rightSection.ariaLabels.cart}
    badge={cart.size > 0 ? `${cart.size}` : ''}
    href="/{page.params.country}/cart"
    src={BiSolidCart}
    type="anchor"
  />
</div>
