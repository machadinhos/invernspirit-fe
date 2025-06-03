<script lang="ts">
  import type { ClassValue } from 'svelte/elements';

  type Props = {
    class?: ClassValue;
    children: import('svelte').Snippet;
    onsubmit: (event: SubmitEvent) => Promise<void>;
    processing: boolean;
  };

  let { class: className, children, onsubmit, processing = $bindable() }: Props = $props();

  const finalOnSubmit = async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();
    if (processing) return;

    try {
      processing = true;
      await onsubmit(event);
    } finally {
      processing = false;
    }
  };
</script>

<form class={className} onsubmit={finalOnSubmit}>
  {@render children()}
</form>
