<script lang="ts">
  import { auth } from '$content';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import SignUp from '$lib/components/ui/auth/SignUp.svelte';

  const actionAfterAuthentication = (): void => {
    goto(`/${page.params.country}`);
  };
</script>

<svelte:head><title>{auth.signUp.headTitle}</title></svelte:head>

<SignUp {actionAfterAuthentication} />
