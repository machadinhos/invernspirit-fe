<script lang="ts">
  import { type IconSrcType, InstagramLogoIcon, PinterestLogoIcon, YoutubeLogoIcon } from '$components-svg-icons';
  import { common } from '$content';
  import HeaderIcon from '../HeaderIcon.svelte';
  import { socialMediaLinks } from '$constants';
</script>

{#snippet mediaButton(src: IconSrcType, href: HTMLAnchorElement['href'], ariaLabel: HTMLAnchorElement['ariaLabel'])}
  <a class="size-fit" aria-label={ariaLabel} {href} target="_blank">
    <HeaderIcon aria-label={null} {src} type="div" />
  </a>
{/snippet}

{@render mediaButton(InstagramLogoIcon, socialMediaLinks.instagram, common.header.leftSection.ariaLabels.instagram)}
{@render mediaButton(PinterestLogoIcon, socialMediaLinks.pinterestP, common.header.leftSection.ariaLabels.pinterest)}
{@render mediaButton(YoutubeLogoIcon, socialMediaLinks.youtube, common.header.leftSection.ariaLabels.youtube)}
