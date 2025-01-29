<script lang="ts">
  import type { Country } from '$types';
  import { CustomSelect } from '$components';
  import { FaSolidChevronDown } from 'svelte-icons-pack/fa';
  import { Icon } from 'svelte-icons-pack';
  import { page } from '$app/state';
  import { untrack } from 'svelte';

  type Props = {
    countries: Country[];
  };

  let { countries }: Props = $props();

  const countriesCodes = countries.map((country) => country.code);

  let selectedCountry = $state(countriesCodes.indexOf(page.params.country.toUpperCase()));
  let isOpen = $state(false);

  $effect(() => {
    const newCountry = countriesCodes[selectedCountry].toLowerCase();
    if (newCountry !== untrack(() => page.params.country)) {
      const newURL = new URL(untrack(() => page.url));
      const pathSegments = newURL.pathname.split('/').filter((segment) => segment !== '');
      pathSegments[0] = newCountry;
      newURL.pathname = `/${pathSegments.join('/')}`;
      window.location.assign(newURL);
    }
  });
</script>

<CustomSelect options={countriesCodes} bind:selected={selectedCountry} bind:isOpen>
  {#snippet triggerElement()}
    <div class="flex w-14 items-center justify-center gap-1">
      <div class="flex items-center gap-1">
        {countriesCodes[selectedCountry]}
        <img
          alt="{countriesCodes[selectedCountry]} flag"
          height="13"
          src="/flags/{countriesCodes[selectedCountry].toLowerCase()}.svg"
          width="13"
        />
      </div>
      <div class="transition-transform duration-300" class:rotate-180={isOpen}>
        <Icon size={10} src={FaSolidChevronDown} />
      </div>
    </div>
  {/snippet}
  {#snippet optionSnippet(text: string, index: number)}
    <div
      class="bg-background hover:bg-primary flex w-14 items-center justify-center gap-1"
      class:bg-primary={index === selectedCountry}
    >
      <span>{text}</span>
      <img alt="{text} flag" height="3" src="/flags/{text.toLowerCase()}.svg" width="13" />
    </div>
  {/snippet}
</CustomSelect>
