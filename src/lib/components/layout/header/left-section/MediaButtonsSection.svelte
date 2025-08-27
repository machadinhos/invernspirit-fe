<script lang="ts">
  import { FaBrandsInstagram, FaBrandsPinterestP, FaBrandsYoutube } from 'svelte-icons-pack/fa';
  import { common } from '$content';
  import HeaderIcon from '../HeaderIcon.svelte';
  import type { IconType } from 'svelte-icons-pack';
  import { socialMediaLinks } from '$constants';
</script>

{#snippet mediaButton(src: IconType, href: HTMLAnchorElement['href'], ariaLabel: HTMLAnchorElement['ariaLabel'])}
  <a class="size-fit" aria-label={ariaLabel} {href} target="_blank">
    <HeaderIcon aria-label={null} {src} type="div" />
  </a>
{/snippet}

{@render mediaButton(FaBrandsInstagram, socialMediaLinks.instagram, common.header.leftSection.ariaLabels.instagram)}
{@render mediaButton(FaBrandsPinterestP, socialMediaLinks.pinterestP, common.header.leftSection.ariaLabels.pinterest)}
{@render mediaButton(FaBrandsYoutube, socialMediaLinks.youtube, common.header.leftSection.ariaLabels.youtube)}
