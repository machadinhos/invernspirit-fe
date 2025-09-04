<script generics="Item extends { trigger: unknown; content: unknown }" lang="ts">
  import { ChevronDownIcon, Icon } from '$components-svg-icons';
  import type { Snippet } from 'svelte';

  type Props = {
    accordionTrigger: Snippet<[Item['trigger']]>;
    accordionContent: Snippet<[Item['content']]>;
    items: Item[];
  };

  let { accordionTrigger, accordionContent, items }: Props = $props();
  const id = $props.id();
</script>

<div class="out-container space-y-1">
  {#each items as item, index (index)}
    {@const elementId = `accordion-${id}-${index}`}
    <div>
      <input id={elementId} type="checkbox" />
      <label class="flex cursor-pointer items-center justify-between gap-2" for={elementId}>
        <div>{@render accordionTrigger(item.trigger)}</div>
        <Icon src={ChevronDownIcon} />
      </label>
      <div>
        <div>
          {@render accordionContent(item.content)}
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .out-container {
    & > div {
      padding-inline: 0.5rem;
      background: var(--color-background);
      & > input {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
        border-width: 0;
        &:focus-visible {
          & + label {
            outline: 2px solid white;
          }
        }
        &:checked {
          & + label > :global(svg) {
            rotate: 180deg;
          }
          & ~ div {
            grid-template-rows: 1fr;
            & > div {
              padding-top: 0.875rem;
              padding-bottom: 0.5rem;
            }
          }
        }
      }
      & > label {
        padding-block: 0.25rem;
      }
      & > div {
        display: grid;
        grid-template-rows: 0fr;
        transition: all 0.2s ease-in-out;
        & > div {
          overflow: hidden;
          padding-left: 0.5rem;
          transition: padding 0.2s ease-in-out;
        }
      }
      & > label > :global(svg) {
        transition: rotate 0.2s ease-in-out;
      }
    }
  }
</style>
