<script lang="ts">
  import type { Attachment } from 'svelte/attachments';
  import { fade } from 'svelte/transition';
  import { modal } from '$state';
  import ModalBody from './ModalBody.svelte';

  const dialogAttachment: Attachment<HTMLDialogElement> = (node: HTMLDialogElement) => {
    node.showModal();
  };

  const onclose = (): void => {
    modal.value?.close();
  };
</script>

{#if modal.value}
  <dialog class="modal-dialog backdrop-blur-sm" {@attach dialogAttachment} {onclose} in:fade|global>
    <ModalBody modal={modal.value} />
  </dialog>
{/if}

<style>
  .modal-dialog {
    width: 100vw;
    height: 100vh;
    max-width: none;
    max-height: none;
    margin: 0;
    padding: 0;
    background: rgba(0, 0, 0, 0.4) none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    inset: 0;
    z-index: 45;
  }
</style>
