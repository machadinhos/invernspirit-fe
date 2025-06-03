<script lang="ts">
  import { FaEye, FaEyeSlash } from 'svelte-icons-pack/fa';
  import BaseInput from './BaseTextInput.svelte';
  import type { ClassValue } from 'svelte/elements';
  import { common } from '$content';
  import { Icon } from 'svelte-icons-pack';
  import type { Snippet } from 'svelte';

  type Props = {
    field: import('$lib/utils/form-fields.svelte').GenericFormField;
    label?: Snippet;
    trailingIcon?: Snippet;
    class?: ClassValue;
  };

  let props: Props = $props();

  let shown = $state(false);

  const toggleShown = (): void => {
    shown = !shown;
  };
</script>

<BaseInput {...props} type={shown ? 'text' : 'password'}>
  {#snippet trailingIcon()}
    <button aria-label={common.hidePasswordButtonAriaLabel} onclick={toggleShown} type="button">
      <Icon src={shown ? FaEye : FaEyeSlash} />
    </button>
  {/snippet}
</BaseInput>
