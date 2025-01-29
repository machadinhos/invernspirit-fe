<script lang="ts">
  type Props = {
    href: HTMLAnchorElement['href'];
    children: import('svelte').Snippet;
    class?: HTMLElement['className'];
    onclick?: (event: Event) => void;
  };

  let { children, href, class: className, onclick = (): void => undefined }: Props = $props();
</script>

<a class="text-primary underline {className}" {href} {onclick}>{@render children()}</a>
