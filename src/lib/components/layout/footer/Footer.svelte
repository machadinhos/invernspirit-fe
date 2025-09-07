<script lang="ts">
  import { Icon, MagnifierIcon } from '$components-svg-icons';
  import { Button } from '$components';
  import { common } from '$content';
  import { containsXSSPatterns } from '$lib/utils/input-validation';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';

  type Props = {
    hideSearchBarOnMobile: boolean;
  };

  let { hideSearchBarOnMobile }: Props = $props();

  let searchString = $state('');

  const doSearch = (event: Event): void => {
    event.preventDefault();
    if (containsXSSPatterns(searchString) || searchString === '') return;
    goto(`/${page.params.country}/shop/search?q=${searchString}`);
    searchString = '';
  };
</script>

<footer class="w-full">
  <form class={['flex h-fit w-full', hideSearchBarOnMobile && 'hidden md:flex']} onsubmit={doSearch}>
    <div class="flex w-full items-center bg-background">
      <div class="px-2">
        <Icon src={MagnifierIcon} />
      </div>
      <input
        name="searchString"
        class="w-full bg-background focus:border-none focus:outline-hidden"
        aria-label={common.footer.searchBarPlaceholder}
        autocomplete="off"
        placeholder={common.footer.searchBarPlaceholder}
        type="search"
        bind:value={searchString}
      />
    </div>
    <Button class="w-20" type="submit">{common.footer.searchButton}</Button>
  </form>
</footer>
