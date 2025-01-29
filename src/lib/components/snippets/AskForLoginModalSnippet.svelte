<script lang="ts" module>
  import AskForLoginComponent from '$lib/components/snippets/AskForLoginComponent.svelte';
  import { type ModalInstance } from '$state';

  type Params = {
    action: () => Promise<void>;
    allowGuest: boolean;
  };

  export { askForLoginModalSnippet };
</script>

{#snippet askForLoginModalSnippet(modal: ModalInstance<Params>, params: Params)}
  <AskForLoginComponent {modal} {...params} />
{/snippet}
