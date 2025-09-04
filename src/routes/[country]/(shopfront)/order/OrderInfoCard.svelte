<script lang="ts">
  type Props = {
    title: string;
    children: import('svelte').Snippet;
  };

  let { title, children }: Props = $props();
</script>

<div class="w-full md:bg-background md:p-5">
  <div class="mb-2 flex w-full justify-center">
    <h4 style="font-size: 1.5rem" class="lineunder">{title}</h4>
  </div>
  {@render children()}
</div>
