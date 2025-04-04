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
      if (typeof turnstile === 'undefined') return false;
      /* eslint-disable-next-line no-undef */
      widgetId = turnstile.render(turnstileContainer, {
        sitekey: PUBLIC_CF_CAPTCHA_SITE_KEY,
        action: action,
        callback,
      });
      return true;
    };

    const tryRender = (): void => {
      if (!renderWidget()) {
        setTimeout(tryRender, 200);
      }
    };

    tryRender();

    return (): void => {
      if (widgetId && typeof turnstile !== 'undefined') {
        /* eslint-disable-next-line no-undef */
        turnstile.remove(widgetId);
      }
    };
  });
</script>

<div class="relative h-[73px] w-full">
  <div
    bind:this={turnstileContainer}
    class="absolute left-1/2 min-h-[73px] -translate-x-1/2 sm:static sm:-translate-x-0"
  ></div>
</div>
