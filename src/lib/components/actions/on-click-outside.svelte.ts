import type { Action } from 'svelte/action';
import { on } from 'svelte/events';

type Params = {
  callback: () => void;
  enabled?: boolean | ((target: HTMLElement) => boolean);
  otherIncludedElements?: (HTMLElement | undefined)[];
  otherIncludedElementsIds?: string[];
  ignoreFirstClick?: boolean;
};

export const onClickOutside: Action<HTMLElement, Params> = (
  node: HTMLElement,
  {
    callback,
    enabled = true,
    otherIncludedElements = [],
    otherIncludedElementsIds = [],
    ignoreFirstClick = false,
  }: Params,
) => {
  $effect(() => {
    let firstClick = !ignoreFirstClick;

    const handleClick = (event: MouseEvent): void => {
      if (!enabled) return;
      if (typeof enabled === 'function' && !enabled(event.target as HTMLElement)) return;
      if (!firstClick) {
        firstClick = true;
        return;
      }

      const otherIncludedElementsById = otherIncludedElementsIds.map((id) => document.getElementById(id));
      const containsTarget = [...otherIncludedElementsById, ...otherIncludedElements, node].some((el) =>
        el?.contains(event.target as HTMLElement),
      );

      if (!containsTarget) callback();
    };

    return on(document, 'click', handleClick, { capture: true });
  });
};
