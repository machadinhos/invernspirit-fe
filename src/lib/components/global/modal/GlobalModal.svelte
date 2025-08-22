<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import type { Attachment } from 'svelte/attachments';
  import { modal } from '$state';
  import ModalBody from './ModalBody.svelte';
  import { onClickOutside } from '$components-attachments';

  const dialogAttachment: Attachment<HTMLDialogElement> = (node: HTMLDialogElement) => {
    node.showModal();
  };

  const onclose = (): void => {
    modal.value?.close();
  };
</script>

{#if modal.value}
  <div class="modal-wrapper fixed inset-0 z-50 h-screen w-screen backdrop-blur-sm" in:fade|global>
    <dialog
      class="modal-dialog flex w-fit items-center justify-center"
      {@attach dialogAttachment}
      {onclose}
      in:scale|global
    >
      <div {@attach onClickOutside({ callback: onclose })}>
        <ModalBody modal={modal.value} />
      </div>
    </dialog>
  </div>
{/if}

<style>
  .modal-wrapper {
    background: rgba(0, 0, 0, 0.4);
  }

  .modal-dialog {
    max-width: none;
    max-height: none;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
