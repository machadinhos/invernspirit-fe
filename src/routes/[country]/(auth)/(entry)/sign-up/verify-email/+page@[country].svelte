<script lang="ts">
  import { cart, user } from '$state';
  import { auth } from '$content';
  import { bffClient } from '$service';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { page } from '$app/state';

  onMount(async () => {
    const email = page.url.searchParams.get('email');
    const code = page.url.searchParams.get('code');

    if (!email || !code) {
      goto(`/${page.params.country}`, { replaceState: true });
      return;
    }

    const payload = {
      email,
      code,
    };

    const { user: signedUpUser, cart: signedUpCart } = await bffClient.user.signUp.verifyEmail(
      page.params.country,
      payload,
    );

    user.value = signedUpUser;
    cart.setCart(signedUpCart);

    goto(`/${page.params.country}`, { replaceState: true });
  });
</script>

<svelte:head><title>{auth.signUp.headTitle}</title></svelte:head>
