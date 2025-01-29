<script lang="ts">
  import type { Country } from '$types';
  import HeaderLeftSection from './left-section/HeaderLeftSection.svelte';
  import HeaderMiddleSection from './middle-section/HeaderMiddleSection.svelte';
  import HeaderRightSection from './right-section/HeaderRightSection.svelte';

  type Props = {
    countries: Country[];
  };

  let { countries }: Props = $props();
</script>

<header>
  <div class="relative z-10 mx-5 flex justify-between lg:mx-10">
    <HeaderLeftSection {countries} />
    <HeaderMiddleSection />
    <HeaderRightSection {countries} />
  </div>
</header>
