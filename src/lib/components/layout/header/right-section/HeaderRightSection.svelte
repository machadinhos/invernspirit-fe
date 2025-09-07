<script lang="ts">
  import { cart } from '$state';
  import { CartIcon } from '$components-svg-icons';
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
  <div class="max-xl:hidden">
    <CountrySelector {countries} />
  </div>
  <UserButton />
  <HeaderIcon
    aria-label={common.header.rightSection.ariaLabels.cart}
    badge={cart.size > 0 ? `${cart.size}` : ''}
    href="/{page.params.country}/cart"
    size={20}
    src={CartIcon}
    type="anchor"
  />
</div>
