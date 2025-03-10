<script lang="ts">
  import { cart, user } from '$state';
  import { bffClient } from '$service';
  import { Button } from '$components';
  import type { Order } from '$types';
  import { order as orderContent } from '$content';
  import { page } from '$app/state';

  type Props = {
    order: Order | null | undefined;
    issue: string | undefined;
  };

  let { order = $bindable(), issue = $bindable() }: Props = $props();

  const onclick = async (): Promise<void> => {
    const { cart: newCart } = await bffClient.user.logout(page.params.country);
    user.value = undefined;
    cart.setCart(newCart);
    issue = 'ask-for-login';
  };
</script>

<div class="flex w-96 max-w-[90%] flex-col items-center">
  <p>{orderContent.wrongUser.message}</p>
  <Button {onclick}>{orderContent.wrongUser.button}</Button>
</div>
