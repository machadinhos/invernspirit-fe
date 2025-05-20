import type { AttachmentGenerator } from './attachment-generator';
import { on } from 'svelte/events';

type Params = {
  callback: () => void;
  otherIncludedElements?: (HTMLElement | undefined)[];
  isEnabled?: boolean;
};

export const onClickOutside: AttachmentGenerator<[Params]> = ({
  callback,
  otherIncludedElements = [],
  isEnabled = true,
}) => {
  return (node) => {
    if (!isEnabled) return;

    const handleClick = (event: MouseEvent): void => {
      const containsTarget = [...otherIncludedElements, node].some((el) => el?.contains(event.target as HTMLElement));

      if (!containsTarget) callback();
    };

    return on(document, 'click', handleClick, { capture: true });
  };
};
