<script lang="ts" module>
  import { common } from '$content';
  import { type Toast } from '$state';

  export { copiedToClipboardToastSnippet };
</script>

<!--eslint-disable-next-line @typescript-eslint/no-unused-vars-->
{#snippet copiedToClipboardToastSnippet(toast: Toast)}
  <p>{common.copyToClipboard}</p>
{/snippet}
