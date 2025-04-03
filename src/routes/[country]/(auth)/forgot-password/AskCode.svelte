<script lang="ts">
  import { Button, VerificationCodeInput } from '$components';
  import { auth } from '$content';
  import { bffClient } from '$service';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { validateRequiredInput } from '$lib/utils/input-validation';

  type Props = {
    email: string;
  };

  let { email }: Props = $props();

  let code = $state('');

  const validateCode = (value: string): boolean => {
    return value.length === 8 && /^[0-9]+$/.test(value) && validateRequiredInput(value);
  };

  const onsubmit = async (event: Event): Promise<void> => {
    event.preventDefault();
    if (!validateCode(code)) return;

    await bffClient.user.forgotPassword.validCode(page.params.country, email, code);

    goto(`/${page.params.country}/forgot-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
  };

  const onSendAnotherCodeClick = async (): Promise<void> => {
    await bffClient.user.forgotPassword.submitEmail(page.params.country, email);
  };
</script>

<form class="w-full" {onsubmit}>
  <h1 class="mb-2.5 text-center text-3xl">{auth.forgotPassword.codePage.title}</h1>
  <p class="text-center">{auth.forgotPassword.codePage.description}</p>
  <div class="mb-2.5 flex w-full justify-center">
    <button class="text-primary" onclick={onSendAnotherCodeClick} type="button"
      >{auth.forgotPassword.codePage.sendAnotherCodeButton}</button
    >
  </div>
  <div class="flex w-full justify-center">
    <VerificationCodeInput length={8} type="numeric" bind:value={code} />
  </div>
  <Button class="mt-2.5" fullWidth type="submit">{auth.forgotPassword.codePage.submitButton}</Button>
</form>
