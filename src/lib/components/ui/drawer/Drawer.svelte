<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import type { ClassValue } from 'svelte/elements';
  import { FaSolidXmark } from 'svelte-icons-pack/fa';
  import { Icon } from 'svelte-icons-pack';
  import { on } from 'svelte/events';
  import { quintOut } from 'svelte/easing';

  type Props = {
    isOpen: boolean;
    children: import('svelte').Snippet;
    class?: ClassValue;
    side?: 'left' | 'right';
    fullWidth?: boolean;
  };

  let { isOpen = $bindable(), children, side = 'left', fullWidth = true, class: className }: Props = $props();

  const closeDrawer = (): void => {
    isOpen = false;
  };

  $effect(() => {
    if (!isOpen) return;
    return on(document, 'keydown', (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        isOpen = false;
      }
    });
  });
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 h-full w-full bg-black/50" transition:fade={{ duration: 500 }}></div>
  <div
    class={[
      'fixed top-0 z-50 h-full bg-background shadow-lg',
      fullWidth ? 'w-full' : 'w-auto',
      side === 'left' ? 'left-0' : 'right-0',
      className,
    ]}
    role="dialog"
    transition:fly={{
      duration: 500,
      easing: quintOut,
      // eslint-disable-next-line svelte/no-top-level-browser-globals
      x: side === 'left' ? -window.innerWidth : window.innerWidth,
      opacity: 1,
    }}
  >
    <div class="h-full overflow-y-auto p-4 pr-8">
      <button class="float-right mt-7" onclick={closeDrawer} type="button">
        <Icon color="white" size="25" src={FaSolidXmark} />
      </button>
      {@render children()}
    </div>
  </div>
{/if}
