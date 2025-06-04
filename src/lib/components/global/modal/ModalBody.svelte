<script generics="ModalParams extends Record<string, unknown> | undefined" lang="ts">
  import type { Component } from 'svelte';
  import { type ModalInstance } from '$state';

  type Props = {
    modal: ModalInstance<ModalParams>;
  };

  let { modal }: Props = $props();

  const Element = modal.element as Component<ModalParams & { modal: ModalInstance<ModalParams> }, Record<never, never>>;
</script>

<Element {...modal.extraParams} {modal} />
