<script lang="ts">
  import { Anchor, Button, CheckBox, TextInput } from '$components';
  import { CaptchaElement, Form } from '$components-utils';
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
    actionAfterForgotPasswordClick?: () => void;
  };

  let { actionAfterAuthentication, showAuthSwitchMessage = true, actionAfterForgotPasswordClick }: Props = $props();

  let rememberMeInput = $state(false);
  let processing = $state(false);
  let resetToken: (() => void) | undefined = $state();

  let captchaToken: string | undefined;

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

  const submitSignIn = async (): Promise<void> => {
    if (!validateFormFields(formFields) || captchaToken === undefined) return;

    const payload = { ...mapFormFieldsToValues(formFields), remember: rememberMeInput, captchaToken };

    try {
      const { user: signedInUser, cart: signedInCart } = await bffClient.user.login(page.params.country, payload);

      user.value = signedInUser;
      cart.setCart(signedInCart);

      gtag('event', 'login', {
        method: 'Email',
      });

      actionAfterAuthentication();
    } catch {
      captchaToken = undefined;
      resetToken?.();
    }
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

  const captchaCallback = (token: string): void => {
    captchaToken = token;
  };
</script>

<Form class="w-full gap-6 pt-10" onsubmit={submitSignIn} bind:processing>
  {#each Object.values(formFields) as field (field.id)}
    <div class="w-full">
      <TextInput {field}>
        {#snippet label()}
          {field.label}
        {/snippet}
      </TextInput>
    </div>
  {/each}

  <div class="mb-4 flex justify-between">
    <CheckBox name="remember-me" label={auth.rememberMeLabel} bind:checked={rememberMeInput} />
    <Anchor class="text-right" href={forgotPasswordUrl} onclick={actionAfterForgotPasswordClick}
      >{auth.signIn.forgotPassword}</Anchor
    >
  </div>

  <CaptchaElement action="log-in" callback={captchaCallback} bind:resetToken />

  <Button class="mt-5" disabled={processing} fullWidth type="submit">{auth.signIn.submitButton}</Button>
</Form>

<OAuthSection {actionAfterAuthentication} bind:processing />

{#if showAuthSwitchMessage}
  <AuthSwitchMessage
    authPage={auth.signUp.title}
    href="/{page.params.country}/sign-up"
    question={auth.signIn.signUpMessage}
  />
{/if}
