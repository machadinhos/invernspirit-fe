<script lang="ts">
  import { draw, scale } from 'svelte/transition';
  import type { ClassValue } from 'svelte/elements';

  type Props = {
    checked: boolean;
    label: string;
    class?: ClassValue;
    disabled?: boolean;
    name: string;
  };

  let { checked = $bindable(), label, class: className, disabled = false, name }: Props = $props();
</script>

<label class={['inline-flex w-max items-center gap-2', disabled ? 'cursor-not-allowed' : 'cursor-pointer', className]}>
  <input {name} class="absolute hidden" {disabled} type="checkbox" bind:checked />
  <div class="flex size-5 items-center justify-center border-2 border-text-secondary">
    <div class="size-full">
      {#if checked}
        <svg class={['bg-primary', disabled && 'brightness-[60%]']} class:checked viewBox="0 0 24 24" transition:scale>
          <path
            d="M4 12l5 5L20 7"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            in:draw
          />
        </svg>
      {/if}
    </div>
  </div>
  <span class="select-none">{label}</span>
</label>
