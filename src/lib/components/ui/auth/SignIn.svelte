<script lang="ts">
  import { Anchor, Button, CheckBox, TextInput } from '$components';
  import { cart, user } from '$state';
  import { FormField, mapFormFieldsToValues, validateFormFields } from '$lib/utils/form-fields.svelte';
  import { validateEmail, validatePassword } from '$lib/utils/input-validation';
  import { auth } from '$content';
  import AuthSwitchMessage from './AuthSwitchMessage.svelte';
  import { bffClient } from '$service';
  import OAuthSection from './OAuthSection.svelte';
  import { page } from '$app/state';

  type Props = {
    actionAfterAuthentication: () => void;
    showAuthSwitchMessage?: boolean;
  };

  let { actionAfterAuthentication, showAuthSwitchMessage = true }: Props = $props();

  const formFields = {
    email: new FormField({
      id: 'sign-in-email',
      type: 'email',
      name: 'email',
      autocomplete: 'username',
      label: auth.signIn.formFields.email.label,
      invalidText: auth.signIn.formFields.email.invalidText,
      validate: validateEmail,
      required: true,
    }),
    password: new FormField({
      id: 'sign-in-password',
      name: 'password',
      type: 'password',
      autocomplete: 'current-password',
      label: auth.signIn.formFields.password.label,
      invalidText: auth.signIn.formFields.password.invalidText,
      validate: (value): boolean => validatePassword(value).isValid,
      required: true,
    }),
  };

  let rememberMeInput = $state(true);

  const submitSignIn = async (event: Event): Promise<void> => {
    if (!validateFormFields(formFields)) return;
    event.preventDefault();

    const payload = { ...mapFormFieldsToValues(formFields), remember: rememberMeInput };
    const { user: signedInUser, cart: signedInCart } = await bffClient.user.login(page.params.country, payload);

    user.value = signedInUser;
    cart.setCart(signedInCart);

    actionAfterAuthentication();
  };

  let forgotPasswordUrl = $derived(
    ((): string => {
      const forgotPasswordUrl = `/${page.params.country}/forgot-password`;
      if (formFields.email.value !== '' && formFields.email.validate(formFields.email.value)) {
        return `${forgotPasswordUrl}?autofill-email=${encodeURIComponent(formFields.email.value)}`;
      }
      return forgotPasswordUrl;
    })(),
  );
</script>

<form class="w-full gap-6 pt-10" onsubmit={submitSignIn}>
  {#each Object.values(formFields) as field (field.id)}
    <div class="w-full">
      <TextInput {field}>
        {#snippet label()}
          {field.label}
        {/snippet}
      </TextInput>
    </div>
  {/each}

  <div class="flex justify-between">
    <CheckBox label={auth.rememberMeLabel} bind:checked={rememberMeInput} />
    <Anchor class="text-right" href={forgotPasswordUrl}>{auth.signIn.forgotPassword}</Anchor>
  </div>

  <Button class="mt-5 w-full" type="submit">{auth.signIn.submitButton}</Button>
</form>

<OAuthSection />

{#if showAuthSwitchMessage}
  <AuthSwitchMessage
    authPage={auth.signUp.title}
    href="/{page.params.country}/sign-up"
    question={auth.signIn.signUpMessage}
  />
{/if}
