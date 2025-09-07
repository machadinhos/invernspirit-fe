<script lang="ts">
  import { EyeIcon, EyeSlashIcon, Icon } from '$components-svg-icons';
  import BaseInput from './BaseTextInput.svelte';
  import type { ClassValue } from 'svelte/elements';
  import { common } from '$content';
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
      <Icon src={shown ? EyeIcon : EyeSlashIcon} />
    </button>
  {/snippet}
</BaseInput>
