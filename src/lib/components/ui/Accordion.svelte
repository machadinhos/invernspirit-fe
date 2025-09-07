<script generics="Item extends { trigger: unknown; content: unknown }" lang="ts">
  import { ChevronDownIcon, Icon } from '$components-svg-icons';
  import type { Snippet } from 'svelte';

  type Props = {
    accordionTrigger: Snippet<[Item['trigger']]>;
    accordionContent: Snippet<[Item['content']]>;
    items: Item[];
    allowMultipleOpen?: boolean;
  };

  let { accordionTrigger, accordionContent, items, allowMultipleOpen = true }: Props = $props();

  let opened: number[] = $state([]);

  const generateTriggerClickCallback = (index: number) => {
    return (): void => {
      const isOpen = opened.includes(index);

      if (isOpen) opened.splice(opened.indexOf(index), 1);
      else if (allowMultipleOpen) opened.push(index);
      else opened = [index];
    };
  };
</script>

<div class="space-y-1">
  {#each items as item, index (index)}
    {@const isOpened = opened.includes(index)}
    <div
      class={[
        'grid w-full [grid-template-rows:2.5em_0fr] bg-background transition-all duration-200',
        isOpened && '[grid-template-rows:2.5em_1fr]',
      ]}
    >
      <button
        class="relative w-full py-1 pr-4 pl-2 text-left"
        onclick={generateTriggerClickCallback(index)}
        type="button"
      >
        <div
          class={[
            'absolute top-1/2 right-2 size-fit -translate-y-1/2 transition-[rotate] duration-200',
            isOpened && 'rotate-180',
          ]}
        >
          <Icon
            class={[
              'absolute top-1/2 right-2 size-fit -translate-y-1/2 transition-[rotate] duration-200',
              isOpened && 'rotate-180',
            ]}
            src={ChevronDownIcon}
          />
        </div>
        {@render accordionTrigger(item.trigger)}
      </button>
      <div class="w-full overflow-hidden">
        <div class="px-2 pt-3.5 pb-2">
          {@render accordionContent(item.content)}
        </div>
      </div>
    </div>
  {/each}
</div>
