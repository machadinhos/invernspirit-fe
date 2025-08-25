<script lang="ts">
  import type { ClassValue, HTMLInputAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type Props = {
    field: import('$lib/utils/form-fields.svelte').GenericFormField;
    type?: HTMLInputAttributes['type'];
    label?: Snippet;
    trailingIcon?: Snippet;
    class?: ClassValue;
  };

  let { field, type, label, trailingIcon, class: className }: Props = $props();
</script>

<div class={[label && 'pt-2.5']}>
  <div class="relative">
    {#if field.type !== 'textarea'}
      <input
        {...field.additionalElementAttributes}
        id={field.id}
        name={field.name}
        class={[
          'peer h-10 w-full border-b-2 border-white bg-transparent focus:border-primary focus:outline-hidden',
          trailingIcon && 'pr-6',
          className,
        ]}
        autocomplete={field.autocomplete}
        onblur={field.onblur}
        oninput={field.oninput}
        required={field.required}
        type={type ?? field.type}
        bind:value={field.value}
      />
    {:else}
      <textarea
        id={field.id}
        name={field.name}
        class={[
          'peer min-h-24 w-full border-b-2 border-white bg-transparent focus:border-primary focus:outline-hidden',
          className,
        ]}
        autocomplete="off"
        onblur={field.onblur}
        oninput={field.oninput}
        required={field.required}
        bind:value={field.value}
      ></textarea>
    {/if}
    {#if trailingIcon}
      <div class="absolute top-1/2 right-1 -translate-y-1/2 text-[#a6a6a6]">
        {@render trailingIcon()}
      </div>
    {/if}
    {#if label}
      <label
        class={[
          'pointer-events-none absolute left-0 text-lg text-text-secondary transition-all select-none peer-focus:-top-3.5 peer-focus:text-sm',
          field.value ? '-top-3.5 text-sm' : 'top-2 text-base',
        ]}
        for={field.id}
      >
        {@render label()}
      </label>
    {/if}
    <p
      class={['pointer-events-none text-sm text-error-light select-none', !field.isValid ? 'opacity-100' : 'opacity-0']}
    >
      {field.invalidText}
    </p>
  </div>
</div>
