<script lang="ts">
  import UserDataPage from '$lib/components/ui/auth/UserDataPage.svelte';
  import VerifyEmailPage from '$lib/components/ui/auth/VerifyEmailPage.svelte';

  type Props = {
    actionAfterAuthentication: () => void;
    showAuthSwitchMessage?: boolean;
    email?: string;
  };

  let { actionAfterAuthentication, showAuthSwitchMessage = true, email: initialEmail }: Props = $props();

  let email: string | undefined = $state(initialEmail);
</script>

{#if email === undefined}
  <UserDataPage {showAuthSwitchMessage} bind:email />
{:else}
  <VerifyEmailPage {actionAfterAuthentication} {email} />
{/if}
