import type { AttachmentGenerator } from './attachment-generator';
import { on } from 'svelte/events';

type Params = {
  callback: () => void;
  otherIncludedElements?: (HTMLElement | undefined)[];
  otherIncludedElementsIds?: string[];
  isEnabled?: boolean;
};

export const onClickOutside: AttachmentGenerator<[Params]> = ({
  callback,
  otherIncludedElements = [],
  otherIncludedElementsIds = [],
  isEnabled = true,
}) => {
  return (node) => {
    if (!isEnabled) return;

    const handleClick = (event: MouseEvent): void => {
      const otherIncludedElementsById = otherIncludedElementsIds.map((id) => document.getElementById(id));
      const containsTarget = [...otherIncludedElementsById, ...otherIncludedElements, node].some((el) =>
        el?.contains(event.target as HTMLElement),
      );

      if (!containsTarget) callback();
    };

    return on(document, 'click', handleClick, { capture: true });
  };
};
