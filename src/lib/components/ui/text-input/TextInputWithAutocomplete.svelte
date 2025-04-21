<script lang="ts">
  import BaseTextInput from '$lib/components/ui/text-input/BaseTextInput.svelte';
  import type { FocusEventHandler } from 'svelte/elements';

  type Props = {
    field: import('$lib/utils/form-fields.svelte').GenericFormField;
    label?: import('svelte').Snippet;
    options: string[];
  };

  let { field, label, options }: Props = $props();

  const id = $props.id();

  let isOpen = $state(false);
  let selectedOption = $state(0);
  let heightFitOptions = $state(4);
  let placement: 'above' | 'below' = $state('below');
  let activeOptions = $derived(
    ((): string[] => {
      return options.filter((option) => option.toLowerCase().includes(field.value.toLowerCase()));
    })(),
  );

  let optionsElement: HTMLElement;
  let respondToValueChange = false;
  let ignoreFocus = false;
  let height = 40;

  const getInputElement = (): HTMLInputElement | undefined => {
    return (document.getElementById(field.id) as HTMLInputElement) ?? undefined;
  };

  const originalOnfocus = field.additionalElementAttributes.onfocus;
  const originalOnblur = field.onblur;

  field.additionalElementAttributes.onfocus = (event: Parameters<FocusEventHandler<HTMLInputElement>>[0]): void => {
    if (ignoreFocus) {
      ignoreFocus = false;
      return;
    }
    selectedOption = options.indexOf(activeOptions[0]);
    isOpen = true;
    originalOnfocus?.(event);
  };

  field.onblur = (event: FocusEvent): void => {
    isOpen = false;
    const eventTarget = event.relatedTarget as HTMLElement | null;
    if (eventTarget && eventTarget.className.includes('autocomplete-option') && optionsElement.contains(eventTarget)) {
      respondToValueChange = false;
      ignoreFocus = true;
      eventTarget.click();
      getInputElement()?.focus();
    }
    originalOnblur(event);
  };

  const existingAdditionalElementAttributes = field.additionalElementAttributes;

  field.additionalElementAttributes = {
    ...existingAdditionalElementAttributes,
    onclick: (): void => {
      isOpen = true;
    },
    role: 'combobox',
    'aria-autocomplete': 'list',
    'aria-haspopup': 'listbox',
    'aria-expanded': `false`,
    'aria-owns': `suggestions-${id}`,
  };

  const trySelectFirstActiveOption = (): boolean => {
    if (activeOptions.includes(options[selectedOption])) return false;
    selectedOption = options.indexOf(activeOptions[0]);
    return true;
  };

  const scrollSelectedOptionIntoView = (): void => {
    const selectedOptionElement = optionsElement.querySelector(`#${id}-option-${selectedOption}`);
    if (!selectedOptionElement) return;
    selectedOptionElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  field.additionalElementAttributes.onkeydown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (trySelectFirstActiveOption()) return;
      if (selectedOption >= options.length - 1) return;
      const nextOption = activeOptions.indexOf(options[selectedOption]) + 1;
      if (nextOption >= activeOptions.length) return;
      selectedOption = options.indexOf(activeOptions[nextOption]);
      scrollSelectedOptionIntoView();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (trySelectFirstActiveOption()) return;
      if (selectedOption <= 0) return;
      const prevOption = activeOptions.indexOf(options[selectedOption]) - 1;
      if (prevOption <= -1) return;
      selectedOption = options.indexOf(activeOptions[prevOption]);
      scrollSelectedOptionIntoView();
    } else if (event.key === 'Enter') {
      if (!isOpen) return;
      event.preventDefault();
      if (activeOptions.indexOf(options[selectedOption]) === -1) return;
      field.value = options[selectedOption];
      field.isValid = field.validate(field.value);
      respondToValueChange = false;
      isOpen = false;
    }
  };

  const generateButtonOnClick = (option: string) => {
    return (): void => {
      field.value = option;
    };
  };

  const generateOnMouseOver = (index: number) => {
    return (): void => {
      selectedOption = options.indexOf(activeOptions[index]);
    };
  };

  const updateRenderOptions = (): void => {
    const windowHeight = window.innerHeight;

    const rect = getInputElement()?.getBoundingClientRect();
    if (rect) {
      const distanceToTop = rect.top;
      const distanceToBottom = windowHeight - rect.bottom;

      placement = distanceToTop > distanceToBottom ? 'above' : 'below';
    }

    heightFitOptions = Math.min(Math.max(Math.floor((windowHeight * 0.75) / height), 1), 5);
  };

  $effect.pre(() => {
    if (!isOpen) return;
    updateRenderOptions();
  });

  $effect(() => {
    void field.value;
    if (respondToValueChange) isOpen = true;
    else respondToValueChange = true;
  });

  $effect(() => {
    selectedOption = options.indexOf(activeOptions[0]);
  });

  $effect(() => {
    getInputElement()?.setAttribute('aria-activedescendant', `${id}-option-${selectedOption}`);
  });

  $effect(() => {
    getInputElement()?.setAttribute('aria-expanded', `${isOpen}`);
  });
</script>

<div class="relative">
  <BaseTextInput {field} {label} />
  <ul
    bind:this={optionsElement}
    id="suggestions-{id}"
    style="max-height: {height * heightFitOptions}px; {placement === 'below' ? 'top: 100%;' : 'bottom: 100%;'}"
    class="bg-background-dark absolute z-10 w-full flex-col overflow-y-auto {isOpen ? 'flex' : 'hidden'}"
    role="listbox"
  >
    {#each activeOptions as option, index (`${option}-${index}`)}
      {@const selected = options.indexOf(activeOptions[index]) === selectedOption}
      <li
        id={`${id}-option-${options.indexOf(activeOptions[index])}`}
        style="height: {height}px;"
        class="autocomplete-option w-full flex-none"
        class:bg-background={selected}
        aria-selected={selected}
        onclick={generateButtonOnClick(option)}
        onfocus={generateOnMouseOver(index)}
        onkeydown={null}
        onmouseover={generateOnMouseOver(index)}
        role="option"
        tabindex="-1"
      >
        {option}
      </li>
    {/each}
  </ul>
</div>
