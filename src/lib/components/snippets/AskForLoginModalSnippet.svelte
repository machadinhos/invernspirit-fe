<script lang="ts" module>
  import AskForLogin from '$lib/components/snippets/AskForLogin.svelte';
  import { type ModalInstance } from '$state';

  type Params = {
    action: () => Promise<void>;
    allowGuest: boolean;
  };

  export { askForLoginModalSnippet };
</script>

{#snippet askForLoginModalSnippet(modal: ModalInstance<Params>, params: Params)}
  <AskForLogin {modal} {params} />
{/snippet}
