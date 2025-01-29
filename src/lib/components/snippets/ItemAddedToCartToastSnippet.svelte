<script lang="ts" module>
  import { Button } from '$components';
  import { cart } from '$content';
  import { page } from '$app/state';
  import { type Toast } from '$state';

  export { itemAddedToCartToastSnippet };
</script>

{#snippet itemAddedToCartToastSnippet(toast: Toast)}
  <p>{cart.itemAddedToCart}</p>
  <div class="flex w-full justify-center">
    <a class="mt-2 inline-block" href="/{page.params.country}/cart">
      <Button onclick={toast.destroy}><strong>{cart.viewCart}</strong></Button>
    </a>
  </div>
{/snippet}
