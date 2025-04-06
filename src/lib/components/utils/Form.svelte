<script lang="ts">
  type Props = {
    class: HTMLFormElement['class'];
    children: import('svelte').Snippet;
    onsubmit: (event: Event) => Promise<void>;
    processing: boolean;
  };

  let { class: className, children, onsubmit, processing = $bindable() }: Props = $props();

  const finalOnSubmit = async (event: Event): Promise<void> => {
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
