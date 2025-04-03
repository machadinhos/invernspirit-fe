<script lang="ts">
  import { Anchor } from '$components';
  import { auth } from '$content';
  import { page } from '$app/state';
</script>

<h1 class="mb-2.5 text-center text-3xl">{auth.forgotPassword.successPage.title}</h1>
<p class="text-center">{auth.forgotPassword.successPage.description}</p>
<p class="text-center">
  {auth.forgotPassword.successPage.cta1}
  <Anchor href="/{page.params.country}/sign-in">{auth.forgotPassword.successPage.cta2}</Anchor>
  {auth.forgotPassword.successPage.cta3}
</p>
