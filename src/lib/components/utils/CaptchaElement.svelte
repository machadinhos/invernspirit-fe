<script lang="ts">
  import { onMount } from 'svelte';
  import { PUBLIC_CF_CAPTCHA_SITE_KEY } from '$env/static/public';

  type Props = {
    callback: (token: string) => void;
    action: string;
  };

  let { callback, action }: Props = $props();

  let turnstileContainer: HTMLDivElement;
  let widgetId: string | null | undefined;

  onMount(() => {
    const renderWidget = (): boolean => {
      /* eslint-disable-next-line no-undef */
      if (!turnstile) return false;
      /* eslint-disable-next-line no-undef */
      widgetId = turnstile.render(turnstileContainer, {
        sitekey: PUBLIC_CF_CAPTCHA_SITE_KEY,
        action: action,
        callback,
      });
      return true;
    };

    let tries = 5;
    while (!renderWidget() && tries > 0) {
      tries--;
    }

    return (): void => {
      /* eslint-disable-next-line no-undef */
      if (widgetId && turnstile) {
        /* eslint-disable-next-line no-undef */
        turnstile.remove(widgetId);
      }
    };
  });
</script>

<div bind:this={turnstileContainer} id="test" class="min-h-[73px]"></div>
