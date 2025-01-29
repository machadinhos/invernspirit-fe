<script lang="ts" module>
  import { type Toast } from '$state';

  export { clientErrorToastSnippet };
</script>

<!--eslint-disable-next-line @typescript-eslint/no-unused-vars-->
{#snippet clientErrorToastSnippet(toast: Toast<string>, error: string)}
  <p>{error}</p>
{/snippet}
