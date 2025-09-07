<script lang="ts">
  import { Icon, PencilIcon } from '$components-svg-icons';

  type Props = {
    children: import('svelte').Snippet;
    hasEditButton: boolean;
    onEditButtonClick: () => void;
    title: string;
  };

  let { children, hasEditButton, onEditButtonClick, title }: Props = $props();
</script>

<div class="relative w-full md:bg-background md:p-5 md:shadow-2xl">
  {#if hasEditButton}
    <button
      class="absolute top-5 right-5 grid size-10 place-items-center text-primary"
      onclick={onEditButtonClick}
      type="button"
    >
      <Icon size="20" src={PencilIcon} />
    </button>
  {/if}
  <div class="mb-2 flex w-full justify-center">
    <h4 style="font-size: 1.5rem" class="lineunder">{title}</h4>
  </div>
  {@render children()}
</div>
