<script lang="ts">
  import { Button } from '$components';
  import { common } from '$content';
  import { containsXSSPatterns } from '$lib/utils/input-validation';
  import { Icon } from 'svelte-icons-pack';
  import { SlMagnifier } from 'svelte-icons-pack/sl';

  let searchString = $state('');

  const doSearch = (): void => {
    if (containsXSSPatterns(searchString) || searchString === '') return;
    alert('todo');
  };
</script>

<footer class="w-full">
  <form class="flex w-full" onsubmit={doSearch}>
    <div class="bg-background flex w-full items-center">
      <div class="px-2">
        <Icon color="white" size="20" src={SlMagnifier} />
      </div>
      <input
        name="searchString"
        class="bg-background w-full focus:border-none focus:outline-hidden"
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
