<script generics="T extends Record<string, unknown> | undefined" lang="ts">
  import type { Component } from 'svelte';
  import { type ModalInstance } from '$state';

  type Props = {
    modal: ModalInstance<T>;
  };

  let { modal }: Props = $props();

  const Element = modal.element as Component<T & { modal: ModalInstance<T> }, Record<never, never>>;
</script>

<Element {...modal.extraParams} {modal} />
