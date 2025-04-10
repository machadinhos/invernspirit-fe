<script lang="ts">
  import { Button, VerificationCodeInput } from '$components';
  import { cart, user } from '$state';
  import { auth } from '$content';
  import { bffClient } from '$service';
  import { Form } from '$components-utils';
  import { page } from '$app/state';

  type Props = {
    actionAfterAuthentication: () => void;
    email: string;
  };

  let { actionAfterAuthentication, email }: Props = $props();

  let code = $state('');
  let processing = $state(false);

  const onSendAnotherCodeClick = async (): Promise<void> => {
    await bffClient.user.signUp.resendEmail(page.params.country, email);
  };

  const onsubmit = async (): Promise<void> => {
    const payload = {
      code,
      email,
    };

    const { user: signedUpUser, cart: signedUpCart } = await bffClient.user.signUp.verifyEmail(
      page.params.country,
      payload,
    );

    user.value = signedUpUser;
    cart.setCart(signedUpCart);

    actionAfterAuthentication();
  };
</script>

<Form class="flex w-full flex-col items-center" {onsubmit} bind:processing>
  <h1 class="mb-2.5 text-center text-3xl">{auth.forgotPassword.codePage.title}</h1>
  <p class="text-center">{auth.forgotPassword.codePage.description}</p>
  <div class="mb-2.5 flex w-full justify-center">
    <p>
      {auth.signUp.verifyEmailPage.didntReceiveCode}
      <button class="text-primary" onclick={onSendAnotherCodeClick} type="button"
        >{auth.signUp.verifyEmailPage.resendEmailButton}</button
      >
    </p>
  </div>

  <VerificationCodeInput length={8} type="numeric" bind:value={code} />

  <Button class="mt-5" disabled={processing} fullWidth type="submit">{auth.signUp.submitButton}</Button>
</Form>
