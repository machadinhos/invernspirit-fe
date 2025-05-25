<script lang="ts">
  import { modal } from '$state';
  import Modal from '$lib/components/ui/Modal.svelte';
  import ModalBody from './ModalBody.svelte';
</script>

{#if modal.value}
  <Modal fadeIn>
    <ModalBody modal={modal.value} />
  </Modal>
{/if}
