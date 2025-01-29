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

let idsGenerated = 0;

export const generateUniqueId = (): string => {
  const timestamp = Date.now();

  const random = Math.floor(Math.random() * 100000);

  const combined = (timestamp + random + idsGenerated) % 100000;

  idsGenerated++;

  return combined.toString().padStart(5, '0');
};
