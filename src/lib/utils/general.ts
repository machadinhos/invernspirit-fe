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
