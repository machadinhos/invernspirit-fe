<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { user } from '$state';

  onMount(() => {
    if (!user.isLoggedIn) goto(`/${page.params.country}`);
  });
</script>
