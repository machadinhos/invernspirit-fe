<script lang="ts">
  import { Anchor, Button, TextInput } from '$components';
  import { FormField, mapFormFieldsToValues, validateFormFields } from '$lib/utils/form-fields.svelte';
  import { auth } from '$content';
  import { bffClient } from '$service';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import PasswordChecks from '$lib/components/ui/auth/PasswordChecks.svelte';
  import { validatePassword } from '$lib/utils/input-validation';

  type Props = {
    email: string;
    code: string;
    pageState: 'ask-email' | 'ask-code' | 'set-password' | 'success' | undefined;
  };

  let { email, code, pageState = $bindable() }: Props = $props();

  let validated: boolean | undefined = $state();

  const formFields = {
    newPassword: new FormField({
      id: 'forgot-password-new-password',
      name: 'newPassword',
      autocomplete: 'new-password',
      type: 'password',
      label: auth.signUp.formFields.password.label,
      invalidText: auth.signUp.formFields.password.invalidText,
      validate: (value): boolean => validatePassword(value).isValid,
      required: true,
    }),
    confirmPassword: new FormField({
      id: 'forgot-password-confirm-password',
      autocomplete: 'new-password',
      type: 'password',
      name: 'confirmPassword',
      label: auth.signUp.formFields.confirmPassword.label,
      invalidText: auth.signUp.formFields.confirmPassword.invalidText,
      validate: (value): boolean => value === formFields.newPassword.value && validatePassword(value).isValid,
      required: true,
      includeInMapping: false,
    }),
  };

  const onsubmit = async (event: Event): Promise<void> => {
    event.preventDefault();

    if (!validateFormFields(formFields)) return;

    const newPassword = mapFormFieldsToValues(formFields).newPassword;
    await bffClient.user.forgotPassword.resetPassword(page.params.country, email, code, newPassword);

    pageState = 'success';
  };

  onMount(async () => {
    if (page.url.searchParams.get('validate-code') === 'true') {
      page.url.searchParams.delete('validate-code');
      goto(page.url);
      try {
        await bffClient.user.forgotPassword.validCode(page.params.country, email, code);
        validated = true;
      } catch {
        validated = false;
      }
    } else {
      validated = true;
    }
  });
</script>

{#if validated === true}
  <form class="w-full" {onsubmit}>
    <h1 class="mb-2.5 text-center text-3xl">{auth.forgotPassword.resetPasswordPage.title}</h1>
    <TextInput field={formFields.newPassword}>
      {#snippet label()}
        {formFields.newPassword.label}
      {/snippet}
    </TextInput>
    <PasswordChecks password={formFields.newPassword.value} />
    <TextInput field={formFields.confirmPassword}>
      {#snippet label()}
        {formFields.confirmPassword.label}
      {/snippet}
    </TextInput>
    <Button class="mt-2.5" fullWidth type="submit">{auth.forgotPassword.resetPasswordPage.submitButton}</Button>
  </form>
{:else if validated === false}
  <div class="text-center">
    <p>{auth.forgotPassword.resetPasswordPage.invalidCode}</p>
    <Anchor href="/{page.params.country}/forgot-password?autofill-email={email}"
      >{auth.forgotPassword.resetPasswordPage.tryAgain}</Anchor
    >
  </div>
{/if}
