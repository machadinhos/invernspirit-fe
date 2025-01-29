<script lang="ts">
  import { Button } from '$components';
  import { common } from '$content';
  import { page } from '$app/state';
</script>

<div class="flex h-full flex-col items-center justify-center">
  <h1>{page.status}: {page.error?.message ?? common.errorPage.messageAlternative}</h1>

  {#if page.status === 404}
    <p>{common.errorPage['404Message']}</p>
  {:else}
    <p>{common.errorPage.otherErrorMessage}</p>
  {/if}

  <a href="/{page.params.country}"><Button>{common.errorPage.button}</Button></a>
</div>
