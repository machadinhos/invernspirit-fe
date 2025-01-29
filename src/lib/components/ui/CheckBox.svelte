<script lang="ts">
  import { scale } from 'svelte/transition';

  type Props = {
    checked: boolean;
    label: string;
  };

  let { checked = $bindable(), label }: Props = $props();
</script>

<label class="inline-flex cursor-pointer items-center gap-2">
  <input class="absolute hidden cursor-pointer" type="checkbox" bind:checked />
  <div class="border-text-secondary flex h-5 w-5 items-center justify-center border-2">
    <div class="h-full w-full">
      {#if checked}
        <svg class="bg-primary" class:checked viewBox="0 0 24 24" transition:scale>
          <path
            d="M4 12l5 5L20 7"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
          />
        </svg>
      {/if}
    </div>
  </div>
  <span class="select-none">{label}</span>
</label>
