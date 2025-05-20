<script lang="ts" module>
  import { auth } from '$content';

  export { openingPopupErrorToastSnippet };
</script>

{#snippet openingPopupErrorToastSnippet()}
  <p>{auth.openingPopupError}</p>
{/snippet}
