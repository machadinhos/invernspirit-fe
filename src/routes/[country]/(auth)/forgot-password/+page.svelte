<script lang="ts">
  import AskCode from './AskCode.svelte';
  import AskEmail from './AskEmail.svelte';
  import { auth } from '$content';
  import { page } from '$app/state';
  import ResetPassword from './ResetPassword.svelte';
  import Success from './Success.svelte';

  let email: string | undefined = $state();
  let code: string | undefined = $state();
  let pageState: 'ask-email' | 'ask-code' | 'set-password' | 'success' | undefined = $state();

  $effect(() => {
    email = page.url.searchParams.get('email') ?? undefined;
    code = page.url.searchParams.get('code') ?? undefined;

    if (!email && !code) pageState = 'ask-email';
    if (email && !code) pageState = 'ask-code';
    if (email && code) pageState = 'set-password';
  });
</script>

<svelte:head><title>{auth.forgotPassword.headTitle}</title></svelte:head>

{#if pageState}
  <div class="flex h-full w-full items-center justify-center">
    <div class="md:bg-background-dark flex w-[90%] max-w-[700px] flex-col items-center py-6">
      <div class="w-[85%]">
        {#if pageState === 'ask-email'}
          <AskEmail />
        {:else if pageState === 'ask-code' && email}
          <AskCode {email} />
        {:else if pageState === 'set-password' && email && code}
          <ResetPassword {code} {email} bind:pageState />
        {:else if pageState === 'success'}
          <Success />
        {/if}
      </div>
    </div>
  </div>
{/if}
