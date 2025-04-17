<script lang="ts">
  import { Button, VerificationCodeInput } from '$components';
  import { bffClient } from '$service';
  import { Form } from '$components-utils';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { profile } from '$content';
  import { validateRequiredInput } from '$lib/utils/input-validation';

  let code: string = $state('');
  let processing = $state(false);

  const validateCode = (value: string): boolean => {
    return value.length === 8 && /^[0-9]+$/.test(value) && validateRequiredInput(value);
  };

  const submitCode = async (): Promise<void> => {
    if (!validateCode(code)) return;

    await bffClient.user.update.email.validateCode(page.params.country, code);
    goto(`/${page.params.country}/profile/user-details`);
  };
</script>

<Form class="w-full" onsubmit={submitCode} bind:processing>
  <h1 class="mb-2.5 text-center text-3xl">{profile.userDetails.updateEmail.title}</h1>
  <p class="text-center">{profile.userDetails.updateEmail.description}</p>
  <div class="flex w-full justify-center">
    <VerificationCodeInput length={8} type="numeric" bind:value={code} />
  </div>

  <Button class="mt-5" disabled={processing} fullWidth type="submit"
    >{profile.userDetails.updateEmail.submitButton}</Button
  >
</Form>
