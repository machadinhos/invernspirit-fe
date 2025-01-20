<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { ShrinkOnClickWrapper } from '$components';

  interface Props {
    type?: HTMLButtonAttributes['type'];
    className?: HTMLButtonAttributes['class'];
    onclick?: () => void;
    children: import('svelte').Snippet;
    disabled?: boolean;
  }

  let { type = 'button', className = '', onclick = () => {}, children, disabled = false }: Props = $props();
</script>

<ShrinkOnClickWrapper {disabled}>
  <button
    class="flex items-center justify-center px-2 py-2 enabled:bg-secondary enabled:hover:bg-primary disabled:bg-[#3c3b38] {className}"
    {disabled}
    onclick={disabled ? () => {} : onclick}
    {type}
  >
    {@render children()}
  </button>
</ShrinkOnClickWrapper>
