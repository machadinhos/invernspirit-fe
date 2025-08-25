<script lang="ts">
  type Props = {
    title: string;
    children: import('svelte').Snippet;
  };

  let { title, children }: Props = $props();
</script>

<div class="w-full md:bg-background md:p-5">
  <div class="mb-2 flex w-full flex-col items-center">
    <h4 style="font-size: 1.5rem" class="text-center">{title}</h4>
    <div class="pointer-events-none h-0.5 w-24 bg-white select-none"></div>
  </div>
  {@render children()}
</div>
