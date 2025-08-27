<script lang="ts">
  import { Anchor, Button, CheckBox } from '$components';
  import { common } from '$content';

  type Props = {
    showConsent: boolean;
  };

  let { showConsent = $bindable() }: Props = $props();

  let customizing = $state(false);
  let agreeToPreferenceCookies = $state(false);
  let agreeToAnalyticsCookies = $state(false);

  const setGtagConsent = (option: boolean): void => {
    const cookieConsent = option ? 'granted' : 'denied';
    gtag('consent', 'update', {
      /* eslint-disable camelcase */
      ad_storage: cookieConsent,
      analytics_storage: cookieConsent,
      /* eslint-enable camelcase */
    });
  };

  const setCookieConsentCookie = (value: string, key = 'cookie_consent'): void => {
    document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax; Secure`;
  };

  const onAccept = (): void => {
    setCookieConsentCookie('all');
    setGtagConsent(true);
    showConsent = false;
  };

  const onCustomize = (): void => {
    customizing = true;
  };

  const onOnlyNecessary = (): void => {
    setCookieConsentCookie('necessary');
    setGtagConsent(false);
    showConsent = false;
  };

  const onCustomizeSave = (): void => {
    if (!agreeToPreferenceCookies && !agreeToAnalyticsCookies) setCookieConsentCookie('necessary');
    else if (agreeToPreferenceCookies && agreeToAnalyticsCookies) setCookieConsentCookie('all');
    else {
      setCookieConsentCookie('custom');
      const cookieConsentCustomValue = [
        agreeToPreferenceCookies && 'preferences',
        agreeToAnalyticsCookies && 'analytics',
      ]
        .filter(Boolean)
        .join(',');
      setCookieConsentCookie(cookieConsentCustomValue, 'cookie_consent_custom');
    }
    if (agreeToAnalyticsCookies) setGtagConsent(true);
    showConsent = false;
  };

  const onCustomizeBack = (): void => {
    customizing = false;
  };
</script>

<div class="fixed bottom-0 z-100 w-full bg-background p-4 text-justify">
  {#if !customizing}
    <div class="flex flex-col gap-4 md:flex-row md:justify-between">
      <div class="space-y-2">
        <h2 class="text-2xl">{common.cookieConsent.title}</h2>
        <p>{common.cookieConsent.text1}</p>
        <p>
          {common.cookieConsent.text2}
          <Anchor href="/cookie-policy">{common.cookieConsent.link}</Anchor>{common.cookieConsent.text3}
        </p>
      </div>
      <div class="flex items-center">
        <div class="flex gap-4 text-nowrap">
          <Button onclick={onAccept}>{common.cookieConsent.accept}</Button>
          <Button onclick={onCustomize}>{common.cookieConsent.customize}</Button>
          <Button onclick={onOnlyNecessary}>{common.cookieConsent.onlyNecessary}</Button>
        </div>
      </div>
    </div>
  {:else if customizing}
    <h2 class="mb-2 text-2xl">{common.cookieConsent.customizationSection.title}</h2>
    <div class="flex flex-col gap-4 md:flex-row md:justify-between">
      <div class="flex-1">
        <CheckBox
          name="necessary-cookies"
          checked={true}
          disabled
          label={common.cookieConsent.customizationSection.requiredCookies.title}
        />
        <p>{common.cookieConsent.customizationSection.requiredCookies.description}</p>
      </div>
      <div class="flex-1">
        <CheckBox
          name="preference-cookies"
          label={common.cookieConsent.customizationSection.preferenceCookies.title}
          bind:checked={agreeToPreferenceCookies}
        />
        <p>{common.cookieConsent.customizationSection.preferenceCookies.description}</p>
      </div>
      <div class="flex-1">
        <CheckBox
          name="analytics-cookies"
          label={common.cookieConsent.customizationSection.analyticsCookies.title}
          bind:checked={agreeToAnalyticsCookies}
        />
        <p>{common.cookieConsent.customizationSection.analyticsCookies.description}</p>
      </div>
      <div class="flex flex-[1.5] items-center justify-center">
        <div class="flex h-fit w-full gap-4">
          <Button fullWidth onclick={onCustomizeSave}>{common.cookieConsent.customizationSection.save}</Button>
          <Button fullWidth onclick={onCustomizeBack}>{common.cookieConsent.customizationSection.back}</Button>
        </div>
      </div>
    </div>
  {/if}
</div>
