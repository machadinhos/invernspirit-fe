<script lang="ts">
  import { CheckIcon, Icon, XMarkIcon } from '$components-svg-icons';
  import { validatePassword } from '$lib/utils/input-validation';

  type Props = {
    password: string;
  };

  let { password }: Props = $props();

  let { errors } = $derived(validatePassword(password));
</script>

{#snippet passwordCheck(text: string, error: boolean)}
  <div class="flex items-center gap-2">
    <Icon color={error ? 'var(--color-error)' : 'var(--color-success)'} src={error ? XMarkIcon : CheckIcon} />
    {text}
  </div>
{/snippet}

{@render passwordCheck('Between 10 and 128 characters.', errors.missingRequiredLengthError)}
{@render passwordCheck('At least 1 uppercase letter.', errors.missingUppercaseLetterError)}
{@render passwordCheck('At least 1 special character.', errors.missingSpecialCharactersError)}
