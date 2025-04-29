<script lang="ts">
  import { bffClient, ClientError } from '$service';
  import { config, loading, user } from '$state';
  import AskForEmail from './AskForEmail.svelte';
  import AskForLogin from './AskForLogin.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import type { Order } from '$types';
  import { order as orderContent } from '$content';
  import OrderDetails from './OrderDetails.svelte';
  import { page } from '$app/state';
  import type { PageData } from './$types';
  import type { RetriesConfig } from '$lib/service/client';
  import WrongUser from './WrongUser.svelte';

  type Props = {
    data: PageData;
  };

  let { data }: Props = $props();

  let order: Order | null | undefined = $state();
  let orderId: string | undefined = $state();
  let issue: 'ask-for-email' | 'ask-for-login' | 'wrong-user' | undefined = $state();

  onMount(() => {
    loading.withLoading(async () => {
      orderId = page.url.searchParams.get('id') ?? undefined;
      if (orderId === undefined) {
        /* eslint-disable-next-line no-console */
        console.error('No order id found');
        goto(`/${page.params.country}`);
        return;
      }
      const isAfterCheckout = page.url.searchParams.get('after-checkout') === 'true';
      let retriesConfig: RetriesConfig;
      if (isAfterCheckout) {
        await config.afterInitialization(() => {
          const url = page.url;
          url.searchParams.delete('after-checkout');
          goto(url, { replaceState: true });
        });

        retriesConfig = {
          maxRetries: 4,
          retryDelay: 2500,
          shouldRetry: (response): boolean => response.status === 404,
        };
      }

      try {
        order = (
          await config.afterInitialization(
            async () =>
              await bffClient.order.getById(page.params.country, orderId ?? '', {
                retriesConfig,
                shouldPushIssuesToToasts: false,
              }),
          )
        ).order;
      } catch (error) {
        if (!(error instanceof ClientError)) {
          order = null;
          return;
        }
        if (error.statusCode === 401) {
          if (user.isLoggedIn) {
            issue = 'wrong-user';
          } else {
            issue = 'ask-for-login';
          }
        } else if (error.statusCode === 422) {
          issue = 'ask-for-email';
        } else {
          order = null;
          error.pushIssuesToToasts();
        }
      }
    });
  });
</script>

<svelte:head><title>{orderContent.headTitle}</title></svelte:head>

<div class="flex h-full w-full flex-col items-center">
  {#if order === null}
    <h1>Order not found</h1>
  {:else if issue === 'ask-for-email'}
    <AskForEmail bind:order bind:issue />
  {:else if issue === 'ask-for-login'}
    <AskForLogin bind:order bind:issue />
  {:else if issue === 'wrong-user'}
    <WrongUser bind:order bind:issue />
  {:else if order !== undefined}
    <OrderDetails country={data.country} {order} />
  {/if}
</div>
