<script lang="ts">
  import { Accordion } from '$components';
  import { faq } from '$content';

  const test = [
    {
      trigger: 'Trigger 1',
      content: 'Content 1',
    },
    {
      trigger: 'Trigger 2',
      content: 'Content 2',
    },
  ];
</script>

<svelte:head><title>{faq.headTitle}</title></svelte:head>

<h1 class="mb-9 text-center text-5xl">{faq.title}</h1>

<div class="flex w-full justify-center">
  <div class="w-[90%] max-w-[750px]">
    <Accordion items={test}>
      {#snippet accordionTrigger(trigger)}
        <h2 class="text-2xl">{trigger}</h2>
      {/snippet}

      {#snippet accordionContent(content)}
        <p>{content}</p>
      {/snippet}
    </Accordion>
  </div>
</div>
