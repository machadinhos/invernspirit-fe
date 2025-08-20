<script lang="ts">
  import { cart, toasts, user } from '$state';
  import { auth } from '$content';
  import { bffClient } from '$service';
  import { googleIcon } from '$components-svg-icons';
  import { on } from 'svelte/events';
  import { OpeningPopupErrorToastComponent } from '$components-toasts';
  import { page } from '$app/state';
  import type { Snippet } from 'svelte';

  type Props = {
    actionAfterAuthentication: () => void;
    processing: boolean;
  };

  let { actionAfterAuthentication, processing = $bindable() }: Props = $props();

  const onContinueWithGoogleClick = async (): Promise<void> => {
    if (processing) return;
    processing = true;

    const width = 600;
    const height = 700;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    const popup = window.open(
      `${window.location.origin}/oauth-loading.html`,
      'google-oauth',
      `width=${width},height=${height},left=${left},top=${top}`,
    );
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      toasts.push(OpeningPopupErrorToastComponent, { type: 'error' });
      return;
    }

    let cleanUpMessageListener: (() => void) | undefined;
    let checkPopupClosedInterval: ReturnType<typeof setInterval> | undefined;
    try {
      const { url } = await bffClient.user.oauth.google.getRedirectUrl(page.params.country);
      popup.location.replace(url);

      checkPopupClosedInterval = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosedInterval);
          setTimeout(() => {
            cleanUpMessageListener?.();
            processing = false;
          }, 400);
        }
      }, 500);

      cleanUpMessageListener = on(window, 'message', async (event) => {
        if (event.origin !== window.location.origin) return;
        clearInterval(checkPopupClosedInterval);
        popup.close();
        cleanUpMessageListener?.();
        const { href } = event.data as { href: string };
        const url = new URL(href);
        const {
          user: signedInUser,
          cart: signedInCart,
          newUser,
        } = await bffClient.user.oauth.google.callback(page.params.country, url);
        user.value = signedInUser;
        cart.setCart(signedInCart);

        gtag('event', newUser ? 'sign_up' : 'login', {
          method: 'Google',
        });

        actionAfterAuthentication();
      });
    } catch (error) {
      processing = false;
      popup.close();
      cleanUpMessageListener?.();
      /* eslint-disable-next-line no-console */
      console.error(error);
    }
  };
</script>

{#snippet oAuthButton(icon: Snippet, label: string, name: string, onclick: () => void)}
  <button
    class={[
      'oauth-button flex h-[35px] w-full items-center justify-center gap-2 rounded-2xl border transition-all hover:scale-110',
      processing && 'brightness-50',
    ]}
    aria-label={label}
    disabled={processing}
    {onclick}
    type="button"
  >
    <div class="flex h-[20px] w-[20px] items-center">
      {@render icon()}
    </div>
    <p>Continue with {name}</p>
  </button>
{/snippet}

<div class="flex w-full flex-col justify-center gap-4">
  <div class="mt-8 flex items-center gap-2">
    <div class="h-0.5 w-full bg-white"></div>
    {auth.orOAuth}
    <div class="h-0.5 w-full bg-white"></div>
  </div>
  <div class="flex w-full flex-col items-center gap-3">
    {@render oAuthButton(googleIcon, auth.googleAriaLabel, auth.googleName, onContinueWithGoogleClick)}
  </div>
</div>

<style>
  :global .oauth-button path {
    transition: fill 250ms ease-in-out;
  }

  :global .oauth-button:not(:hover) path {
    fill: white !important;
  }
</style>
