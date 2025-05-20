<script lang="ts">
  import { Button, CheckBox, TextInput } from '$components';
  import { CaptchaElement, Form } from '$components-utils';
  import { FormField, mapFormFieldsToValues, validateFormFields } from '$lib/utils/form-fields.svelte';
  import { validateEmail, validatePassword, validateRequiredInput } from '$lib/utils/input-validation';
  import { auth } from '$content';
  import AuthSwitchMessage from './AuthSwitchMessage.svelte';
  import { bffClient } from '$service';
  import OAuthSection from './OAuthSection.svelte';
  import { page } from '$app/state';
  import PasswordChecks from './PasswordChecks.svelte';

  type Props = {
    actionAfterAuthentication: () => void;
    showAuthSwitchMessage?: boolean;
    email?: string;
  };

  let { actionAfterAuthentication, showAuthSwitchMessage = true, email = $bindable() }: Props = $props();

  let captchaToken: string | undefined;

  let rememberMeInput = $state(true);
  let processing = $state(false);
  let resetToken: (() => void) | undefined = $state();

  const formFields = {
    firstName: new FormField({
      id: 'sign-up-first-name',
      name: 'firstName',
      autocomplete: 'given-name',
      type: 'text',
      label: auth.signUp.formFields.firstName.label,
      invalidText: auth.signUp.formFields.firstName.invalidText,
      validate: validateRequiredInput,
      required: true,
    }),
    lastName: new FormField({
      id: 'sign-up-last-name',
      name: 'lastName',
      autocomplete: 'family-name',
      type: 'text',
      label: auth.signUp.formFields.lastName.label,
      invalidText: auth.signUp.formFields.lastName.invalidText,
      validate: validateRequiredInput,
      required: true,
    }),
    email: new FormField({
      id: 'sign-up-email',
      name: 'email',
      autocomplete: 'username',
      type: 'email',
      label: auth.signUp.formFields.email.label,
      invalidText: auth.signUp.formFields.email.invalidText,
      validate: validateEmail,
      required: true,
    }),
    password: new FormField({
      id: 'sign-up-password',
      name: 'password',
      autocomplete: 'new-password',
      type: 'password',
      label: auth.signUp.formFields.password.label,
      invalidText: auth.signUp.formFields.password.invalidText,
      validate: (value): boolean => validatePassword(value).isValid,
      required: true,
    }),
    confirmPassword: new FormField({
      id: 'sign-up-confirm-password',
      autocomplete: 'new-password',
      type: 'password',
      name: 'confirmPassword',
      label: auth.signUp.formFields.confirmPassword.label,
      invalidText: auth.signUp.formFields.confirmPassword.invalidText,
      validate: (value): boolean => value === formFields.password.value && validatePassword(value).isValid,
      required: true,
      includeInMapping: false,
    }),
  };

  const submitSignUp = async (): Promise<void> => {
    if (!validateFormFields(formFields) || captchaToken === undefined) return;

    const payload = {
      ...mapFormFieldsToValues(formFields),
      remember: rememberMeInput,
      captchaToken,
    };

    try {
      await bffClient.user.signUp.create(page.params.country, payload);
      email = payload.email;
    } catch {
      captchaToken = undefined;
      resetToken?.();
    }
  };

  const captchaCallback = (token: string): void => {
    captchaToken = token;
  };
</script>

<Form class="w-full gap-6 pt-10" onsubmit={submitSignUp} bind:processing>
  <div class="flex w-full gap-4">
    {#each [formFields.firstName, formFields.lastName] as field (field.id)}
      <div class="w-1/2">
        <TextInput {field}>
          {#snippet label()}
            {field.label}
          {/snippet}
        </TextInput>
      </div>
    {/each}
  </div>

  {#each [formFields.email, formFields.password, formFields.confirmPassword] as field (field.id)}
    <div class="w-full">
      <TextInput {field}>
        {#snippet label()}
          {field.label}
        {/snippet}
      </TextInput>
      {#if field.label === 'Password'}
        <PasswordChecks password={formFields.password.value} />
      {/if}
    </div>
  {/each}

  <CheckBox class="mb-4" label={auth.rememberMeLabel} bind:checked={rememberMeInput} />

  <CaptchaElement action="sign-up" callback={captchaCallback} bind:resetToken />

  <Button class="mt-5" disabled={processing} fullWidth type="submit">{auth.signUp.submitButton}</Button>
</Form>

<OAuthSection {actionAfterAuthentication} />

{#if showAuthSwitchMessage}
  <AuthSwitchMessage
    authPage={auth.signIn.title}
    href="/{page.params.country}/sign-in"
    question={auth.signUp.signInMessage}
  />
{/if}
