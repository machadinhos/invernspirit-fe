<script lang="ts">
  import { Anchor } from '$components';

  type Props = {
    question: string;
    href: HTMLAnchorElement['href'];
    authPage: string;
  };

  let { question, href, authPage }: Props = $props();
</script>

<div class="mt-10">
  <p class="text-center">
    {question}
    <Anchor {href}>{authPage}</Anchor>
  </p>
</div>
