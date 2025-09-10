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

<div class={[label && 'pt-2.5', !field.isValid && 'caret-error-light']}>
  <div class="relative">
    {#if field.type !== 'textarea'}
      <input
        {...field.additionalElementAttributes}
        id={field.id}
        name={field.name}
        class={['peer h-10 w-full border-b-2 border-white focus:border-primary', trailingIcon && 'pr-7', className]}
        autocomplete={field.autocomplete}
        max={field.max}
        maxlength={field.maxlength}
        min={field.min}
        minlength={field.minlength}
        onblur={field.onblur}
        oninput={field.oninput}
        required={field.required}
        type={type ?? field.type}
        bind:value={field.value}
      />
    {:else}
      <!-- eslint-disable @typescript-eslint/no-explicit-any -->
      <textarea
        {...field.additionalElementAttributes as any}
        id={field.id}
        name={field.name}
        class={[
          'peer field-sizing-content max-h-72 min-h-20 w-full border-b-2 border-white focus:border-primary',
          className,
        ]}
        autocomplete="off"
        maxlength={field.maxlength}
        minlength={field.minlength}
        onblur={field.onblur}
        oninput={field.oninput}
        required={field.required}
        bind:value={field.value}
      ></textarea>
      <!-- eslint-enable @typescript-eslint/no-explicit-any -->
    {/if}
    {#if trailingIcon}
      <div class="absolute top-1/2 right-0.5 -translate-y-1/2 text-[#a6a6a6]">
        {@render trailingIcon()}
      </div>
    {/if}
    {#if label}
      <label
        class={[
          `pointer-events-none absolute left-0 text-lg text-text-secondary transition-all select-none peer-focus:text-sm`,
          field.type === 'textarea'
            ? ['peer-focus:-top-3.5', field.value ? '-top-3.5 text-sm' : 'top-2 text-base']
            : ['peer-focus:-top-2', field.value ? '-top-2 text-sm' : 'top-2 text-base'],
        ]}
        for={field.id}
      >
        {@render label()}
      </label>
    {/if}
    <p
      class={['pointer-events-none text-sm text-error-light select-none', field.isValid ? 'opacity-0' : 'opacity-100']}
    >
      {field.invalidText}
    </p>
  </div>
</div>
