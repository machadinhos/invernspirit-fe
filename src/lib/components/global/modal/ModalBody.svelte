<script lang="ts">
  import { beforeNavigate } from '$app/navigation';
  import type { Component } from 'svelte';
  import { type ModalInstance } from '$state';

  type Props = {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    modal: ModalInstance<any>;
  };

  let { modal }: Props = $props();

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const Element = modal.element as Component<any, Record<never, never>>;

  beforeNavigate(() => {
    if (modal.closeOnNavigate) modal.close();
  });
</script>

<Element {...modal.extraParams} {modal} />
