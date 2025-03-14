<script lang="ts">
  import { bffClient } from '$service';
  import { loading } from '$state';
  import type { Order } from '$types';
  import { page } from '$app/state';
  import SignIn from '$lib/components/ui/auth/SignIn.svelte';

  type Props = {
    order: Order | null | undefined;
    issue: string | undefined;
  };

  let { order = $bindable(), issue = $bindable() }: Props = $props();

  const actionAfterAuthentication = (): void => {
    const orderId = page.url.searchParams.get('id') ?? undefined;

    loading.withLoading(async () => {
      try {
        order = (await bffClient.order.getById(page.params.country, orderId ?? '')).order;
      } catch {
        order = null;
      } finally {
        issue = undefined;
      }
    });
  };
</script>

<div class="w-96 max-w-[90%]">
  <SignIn {actionAfterAuthentication} showAuthSwitchMessage={false} />
</div>
