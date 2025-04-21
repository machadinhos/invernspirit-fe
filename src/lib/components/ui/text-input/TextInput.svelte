<script lang="ts">
  import BaseTextInput from './BaseTextInput.svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import PasswordTextInput from './PasswordTextInput.svelte';
  import type { Snippet } from 'svelte';

  type Props = {
    field: import('$lib/utils/form-fields.svelte').GenericFormField;
    label?: Snippet;
    trailingIcon?: Snippet;
    class?: HTMLInputAttributes['class'];
  };

  let props: Props = $props();
</script>

{#if props.field.type === 'password'}
  <PasswordTextInput {...props} />
{:else}
  <BaseTextInput {...props} />
{/if}
