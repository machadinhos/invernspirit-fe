import { generateUniqueId } from '$lib/utils/general';
import type { Snippet } from 'svelte';

type DurationOptions =
  | {
      duration?: number;
      pauseTimeOnHover?: boolean;
      hasRemainingTimeLine?: boolean;
    }
  | { duration: null };

type ToastOptions<T> = DurationOptions & {
  hasCloseButton: boolean;
  type: 'normal' | 'error' | 'success';
  extraParams?: T;
  group?: string;
};

type Element<T> = Snippet<[Toast<T>, T]>;

class Toast<T = void> {
  declare readonly hasCloseButton: boolean;
  declare readonly duration: number | null;
  declare readonly pauseTimeOnHover: boolean;
  declare readonly hasRemainingTimeLine: boolean;
  declare readonly element: Element<T>;
  declare readonly extraParams: T | undefined;
  declare readonly id: string;
  declare readonly destroy: () => undefined;
  declare readonly type: 'normal' | 'error' | 'success';
  declare readonly group: string | undefined;

  constructor(
    element: Element<T>,
    { hasCloseButton = true, duration = 4000, type = 'normal', extraParams, group, ...rest }: Partial<ToastOptions<T>>,
  ) {
    let pauseTimeOnHover = true;
    let hasRemainingTimeLine = true;
    if (
      'pauseTimeOnHover' in rest &&
      'hasRemainingTimeLine' in rest &&
      rest.pauseTimeOnHover !== undefined &&
      rest.hasRemainingTimeLine !== undefined
    ) {
      pauseTimeOnHover = rest.pauseTimeOnHover;
      hasRemainingTimeLine = rest.hasRemainingTimeLine;
    }
    this.pauseTimeOnHover = pauseTimeOnHover;
    this.hasRemainingTimeLine = hasRemainingTimeLine;
    this.hasCloseButton = hasCloseButton;
    this.duration = duration;
    this.element = element;
    this.extraParams = extraParams;
    this.id = generateUniqueId();
    this.destroy = (): undefined => {
      toasts.value = toasts.value.filter((toast) => toast.id !== this.id);
    };
    this.type = type;
    this.group = group;
  }
}

export class Toasts {
  value: Toast<unknown>[] = $state([]);
  private restOfToasts: Toast<unknown>[] = [];
  private readonly maxToasts = 5;

  constructor() {
    $effect.root(() => {
      $effect(() => {
        if (this.value.length >= this.maxToasts) return;
        setTimeout(() => {
          const toastsToAdd = Math.min(this.maxToasts - this.value.length, this.restOfToasts.length);
          for (let i = 0; i < toastsToAdd; i++) {
            const newToast = this.restOfToasts.pop();
            if (!newToast) return;
            this.value.unshift(newToast);
          }
        }, 550);
      });
    });
  }

  push = <T = void>(element: Element<T>, options?: Partial<ToastOptions<T>>): Toast<T> => {
    const newToast = new Toast<T>(element, options ?? {});
    if (this.value.length < this.maxToasts) {
      this.value.unshift(newToast as Toast<unknown>);
    } else {
      this.restOfToasts.unshift(newToast as Toast<unknown>);
    }
    return newToast;
  };

  filterOutGroup = (group: string): void => {
    this.restOfToasts = this.restOfToasts.filter((toast) => toast.group !== group);
    this.value = this.value.filter((toast) => toast.group !== group);
  };
}

export const toasts = new Toasts();
export type { Toast };
