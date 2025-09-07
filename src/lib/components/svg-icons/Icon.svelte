<script lang="ts">
  import type { ClassValue } from 'svelte/elements';

  type Props = {
    src: { v: `${number} ${number} ${number} ${number}`; c: `<${string}>` };
    size?: `${number}` | `${number}em` | number;
    color?: CSSStyleDeclaration['color'];
    class?: ClassValue;
  };

  let { src, size = '24', color = 'currentColor', class: className }: Props = $props();
</script>

<svg style:color class={className} height={size} viewBox={src.v} width={size} xmlns="http://www.w3.org/2000/svg">
  <!-- eslint-disable-next-line svelte/no-at-html-tags-->
  {@html src.c}
</svg>
