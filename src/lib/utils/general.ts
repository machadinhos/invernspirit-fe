export const capitalize = (text: string): string => {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const transition = (action: () => void): void => {
  if (!document.startViewTransition) {
    action();
    return;
  }
  document.startViewTransition(action);
};

export const truncateWithEllipsis = (input: string, maxLength: number): string => {
  const ellipsis = '...';
  if (input.length <= maxLength) {
    return input;
  }
  const truncateTo = maxLength - ellipsis.length;
  return input.slice(0, truncateTo) + ellipsis;
};
