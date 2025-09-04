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
  <div class="fixed z-50 h-screen w-screen bg-black/40 backdrop-blur-sm" in:fade|global>
    <dialog class="fixed m-auto w-fit" {@attach dialogAttachment} {onclose} in:scale|global>
      <div {@attach onClickOutside({ callback: onclose })}>
        <ModalBody modal={modal.value} />
      </div>
    </dialog>
  </div>
{/if}
