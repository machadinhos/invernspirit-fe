<script lang="ts">
  import { FaSolidPencil } from 'svelte-icons-pack/fa';
  import { Icon } from 'svelte-icons-pack';

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
    <div class="absolute top-5 right-5">
      <button class="flex size-10 items-center justify-center text-primary" onclick={onEditButtonClick} type="button">
        <Icon size="20" src={FaSolidPencil} />
      </button>
    </div>
  {/if}
  <div class="mb-2 flex w-full flex-col items-center">
    <h4 style="font-size: 1.5rem" class="text-center">{title}</h4>
    <div class="pointer-events-none h-0.5 w-24 bg-white select-none"></div>
  </div>
  {@render children()}
</div>
