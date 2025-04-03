<script lang="ts">
  import { bffClient } from '$service';
  import { config } from '$state';
  import { onMount } from 'svelte';
  import type { Order } from '$types';
  import OrderSummary from './OrderSummary.svelte';
  import { page } from '$app/state';

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
  <div class="flex flex-col gap-5">
    {#each orders as order (order.id)}
      <OrderSummary country={data.country} {order} />
    {/each}
  </div>
{/if}
