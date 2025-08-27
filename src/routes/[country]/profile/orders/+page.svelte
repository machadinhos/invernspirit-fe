<script lang="ts">
  import { bffClient } from '$service';
  import { config } from '$state';
  import { onMount } from 'svelte';
  import type { Order } from '$types';
  import OrderSummary from './OrderSummary.svelte';
  import { page } from '$app/state';
  import { profile } from '$content';

  type Props = {
    data: import('./$types').PageData;
  };

  let { data }: Props = $props();

  let orders: Order[] | undefined = $state();

  onMount(() => {
    config.afterInitialization(async () => {
      orders = (await bffClient.order.getAll(page.params.country)).orders;
    });
  });
</script>

{#if orders !== undefined}
  <div class="space-y-5">
    {#each orders as order (order.id)}
      <OrderSummary country={data.country} {order} />
    {:else}
      <p class="text-2xl">{profile.orders.noOrders}</p>
    {/each}
  </div>
{/if}
