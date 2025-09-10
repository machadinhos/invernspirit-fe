<script lang="ts">
  import type { Attachment } from 'svelte/attachments';
  import { modal } from '$state';
  import ModalBody from './ModalBody.svelte';
  import { onClickOutside } from '$components-attachments';
  import { scale } from 'svelte/transition';

  const dialogAttachment: Attachment<HTMLDialogElement> = (node: HTMLDialogElement) => {
    node.showModal();
  };

  const onclose = (): void => {
    modal.value?.close();
  };
</script>

{#if modal.value}
  <dialog class="w-fit" {@attach dialogAttachment} {onclose} in:scale|global>
    <div {@attach onClickOutside({ callback: onclose })}>
      <ModalBody modal={modal.value} />
    </div>
  </dialog>
{/if}

<style>
  dialog {
    margin: auto;
    max-width: none;

    &::backdrop {
      background: #0000004d;
      backdrop-filter: blur(8px);
      transition: opacity 0.3s ease-in-out;
    }
  }

  @starting-style {
    dialog::backdrop {
      opacity: 0;
    }
  }
</style>
