import type { Action } from 'svelte/action';
import { on } from 'svelte/events';

type Params = {
  callback: () => void;
  otherIncludedElements?: (HTMLElement | undefined)[];
  otherIncludedElementsIds?: string[];
  isEnabled?: () => boolean;
};

export const onClickOutside: Action<HTMLElement, Params> = (
  node: HTMLElement,
  { callback, otherIncludedElements = [], otherIncludedElementsIds = [], isEnabled = (): boolean => true }: Params,
) => {
  $effect(() => {
    const handleClick = (event: MouseEvent): void => {
      if (!isEnabled()) return;

      const otherIncludedElementsById = otherIncludedElementsIds.map((id) => document.getElementById(id));
      const containsTarget = [...otherIncludedElementsById, ...otherIncludedElements, node].some((el) =>
        el?.contains(event.target as HTMLElement),
      );

      if (!containsTarget) callback();
    };

    return on(document, 'click', handleClick, { capture: true });
  });
};
