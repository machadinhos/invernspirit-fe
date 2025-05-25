<script lang="ts">
  import { Button } from '$components';
  import { cart } from '$content';
  import { page } from '$app/state';
  import { type Toast } from '$state';

  type Props = {
    toast: Toast;
  };

  let { toast }: Props = $props();
</script>

<p>{cart.itemAddedToCart}</p>
<div class="flex w-full justify-center">
  <a class="mt-2 inline-block" href="/{page.params.country}/cart">
    <Button onclick={toast.destroy} shrinkOnClick={false}><strong>{cart.viewCart}</strong></Button>
  </a>
</div>
