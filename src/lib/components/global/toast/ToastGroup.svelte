<script lang="ts">
  import { flip } from 'svelte/animate';
  import Toast from './Toast.svelte';
  import { toasts } from '$state';
</script>

<div
  class="pointer-events-none fixed bottom-12 left-0 z-50 flex w-full flex-col items-center gap-3 sm:right-0 sm:left-auto sm:items-end"
>
  {#each toasts.value as toast (toast.id)}
    <div class="pointer-events-auto" animate:flip={{ duration: 200 }}>
      <Toast {toast} />
    </div>
  {/each}
</div>
