<script generics="T extends { trigger: unknown; content: unknown }" lang="ts">
  import { FaSolidChevronDown } from 'svelte-icons-pack/fa';
  import { Icon } from 'svelte-icons-pack';
  import type { Snippet } from 'svelte';

  type Props = {
    accordionTrigger: Snippet<[T['trigger']]>;
    accordionContent: Snippet<[T['content']]>;
    items: T[];
    allowMultipleOpen?: boolean;
  };

  let { accordionTrigger, accordionContent, items, allowMultipleOpen = true }: Props = $props();
  const id = $props.id();

  let opened: number[] = $state([]);

  const heights: Record<number, number> = {};

  const generateTriggerClickCallback = (index: number) => {
    return (): void => {
      const isOpen = opened.includes(index);

      if (isOpen) opened.splice(opened.indexOf(index), 1);
      else if (allowMultipleOpen) opened.push(index);
      else opened = [index];
    };
  };

  const calculateContentHeight = (index: number): number => {
    if (!heights[index]) {
      const content = document.getElementById(`${id}-accordion-content-${index}`);

      heights[index] = content?.scrollHeight ?? 0;
    }

    return heights[index];
  };
</script>

<div class="flex flex-col gap-1">
  {#each items as item, index (index)}
    {@const isOpened = opened.includes(index)}
    <div class="bg-background w-full">
      <button
        class="relative w-full py-1 pr-4 pl-2 text-left"
        onclick={generateTriggerClickCallback(index)}
        type="button"
      >
        <div
          class="absolute top-1/2 right-2 h-fit w-fit -translate-y-1/2 transition-all duration-200"
          class:rotate-180={isOpened}
        >
          <Icon src={FaSolidChevronDown} />
        </div>
        {@render accordionTrigger(item.trigger)}
      </button>
      <div
        id="{id}-accordion-content-{index}"
        style={isOpened ? `height: ${calculateContentHeight(index)}px` : 'height: 0px'}
        class="relative w-full overflow-hidden transition-all duration-200"
        class:pb-2={isOpened}
      >
        <div class="absolute top-0 left-0 w-full px-2 pt-3.5 pb-2">
          {@render accordionContent(item.content)}
        </div>
      </div>
    </div>
  {/each}
</div>
