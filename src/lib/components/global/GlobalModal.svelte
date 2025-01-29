<script lang="ts">
  import { modal } from '$state';
  import Modal from '$lib/components/ui/Modal.svelte';
</script>

{#if modal.value}
  <Modal fadeIn>
    {@render modal.value.element(modal.value, modal.value.extraParams)}
  </Modal>
{/if}
