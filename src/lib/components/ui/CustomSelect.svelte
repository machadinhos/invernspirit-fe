<script generics="Option" lang="ts">
  import { onClickOutside } from '$components-attachments';
  import type { Snippet } from 'svelte';

  type Props = {
    triggerElement: Snippet;
    optionSnippet: Snippet<[Option, number]>;
    options: Option[];
    selected: number;
    focused: number;
    isOpen: boolean;
  };

  let {
    triggerElement,
    optionSnippet,
    options,
    selected = $bindable(),
    focused = $bindable(),
    isOpen = $bindable(),
  }: Props = $props();
  const id = $props.id();

  let triggerElementRef: HTMLButtonElement;

  const toggleOpen = (): void => {
    isOpen = !isOpen;
  };

  const closeSelect = (): void => {
    if (!isOpen) return;
    isOpen = false;
    triggerElementRef.focus();
  };

  const getSelectOptionCallback = (index: number) => {
    return (): void => {
      closeSelect();
      selected = index;
    };
  };

  const focusOption = (index: number): void => {
    focused = index;
    document.getElementById(`${id}-option-${index}`)?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case 'Escape':
        closeSelect();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (focused < options.length - 1) focusOption(focused + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (focused > 0) focusOption(focused - 1);
        break;
      case 'Tab':
        closeSelect();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        closeSelect();
        selected = focused;
        break;
      default:
        break;
    }
  };

  $effect(() => {
    if (isOpen) {
      focused = selected;
      document.getElementById(`${id}-option-${selected}`)?.focus();
    }
  });
</script>

<div class="relative" {@attach onClickOutside({ callback: closeSelect, isEnabled: isOpen })}>
  <button
    bind:this={triggerElementRef}
    class={['flex cursor-pointer items-center gap-1 bg-background', isOpen && 'open']}
    aria-controls={`${id}-listbox`}
    aria-expanded={isOpen}
    aria-haspopup="listbox"
    onclick={toggleOpen}
    type="button"
  >
    {@render triggerElement()}
  </button>
  {#if isOpen}
    <ul id={`${id}-listbox`} class="absolute top-full flex cursor-pointer flex-col" role="listbox" tabindex="-1">
      {#each options as option, index (index)}
        <li
          id={`${id}-option-${index}`}
          aria-selected={selected === index}
          onclick={getSelectOptionCallback(index)}
          onkeydown={handleKeyDown}
          role="option"
          tabIndex={index === focused ? 0 : -1}
        >
          {@render optionSnippet(option, index)}
        </li>
      {/each}
    </ul>
  {/if}
</div>
