import type { Snippet } from 'svelte';

type BaseToastOptions = {
  duration?: number;
  pauseTimeOnHover?: boolean;
  hasRemainingTimeLine?: boolean;
  hasCloseButton?: boolean;
  type?: 'normal' | 'error' | 'success';
  group?: string;
  singleton?: boolean;
};

type ToastOptions<T> = BaseToastOptions & {
  extraParams: T;
};

type Element<T> = (toast: Toast<T>, extraParams: T) => ReturnType<Snippet>;
type NoExtraParamsElement = (toast: Toast) => ReturnType<Snippet>;

class Toast<T = never> {
  remainingTime = $state() as number | null;
  timeoutId: ReturnType<typeof setTimeout> | undefined = $state();
  lastTime: number | undefined = $state();
  intervalId: ReturnType<typeof setInterval> | undefined = $state();
  progress = $state(100);

  declare readonly hasCloseButton: boolean;
  declare readonly duration: number | null;
  declare readonly pauseTimeOnHover: boolean;
  declare readonly hasRemainingTimeLine: boolean;
  declare readonly element: Element<T>;
  declare readonly extraParams: T extends never ? undefined : T;
  declare readonly id: symbol;
  declare readonly destroy: () => void;
  declare readonly type: 'normal' | 'error' | 'success';
  declare readonly singleton: boolean;

  constructor(
    element: Element<T>,
    {
      pauseTimeOnHover = true,
      hasRemainingTimeLine = true,
      hasCloseButton = true,
      duration = 4000,
      type = 'normal',
      group,
      singleton = false,
      ...rest
    }: T extends never ? BaseToastOptions : ToastOptions<T>,
  ) {
    this.extraParams = ('extraParams' in rest ? rest.extraParams : undefined) as T extends never ? undefined : T;
    this.remainingTime = duration;

    this.pauseTimeOnHover = pauseTimeOnHover;
    this.hasRemainingTimeLine = hasRemainingTimeLine;
    this.hasCloseButton = hasCloseButton;
    this.duration = duration;
    this.element = element;
    this.id = Symbol(group);
    this.destroy = (): undefined => {
      toasts.value = toasts.value.filter((toast) => toast.id !== this.id);
    };
    this.type = type;
    this.singleton = singleton;
  }

  startTimer = (): void => {
    if (this.remainingTime === null) return;
    this.lastTime = Date.now();
    this.timeoutId = setTimeout(() => {
      this.destroy();
    }, this.remainingTime);
  };

  pauseTimer = (): void => {
    if (this.remainingTime === null) return;
    if (this.timeoutId !== undefined && this.lastTime !== undefined) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
      const elapsed = Date.now() - this.lastTime;
      this.remainingTime -= elapsed;
    }
  };

  resetTimer = (): void => {
    if (this.intervalId === undefined) return;
    if (this.timeoutId !== undefined) clearTimeout(this.timeoutId);
    this.remainingTime = this.duration;
    this.startTimer();
  };
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

  push(element: NoExtraParamsElement, options?: BaseToastOptions): Toast<undefined>;
  push<T>(element: Element<T>, options: ToastOptions<T>): Toast<T>;
  push<T>(
    element: NoExtraParamsElement | Element<T>,
    options: BaseToastOptions | ToastOptions<T> = {},
  ): Toast<T | undefined> {
    if (options?.singleton && options.group !== undefined) {
      const existingToast = this.findToastByGroup(options.group);
      if (existingToast) {
        existingToast.resetTimer();
        return existingToast as Toast<T | undefined>;
      }
    }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const newToast = new Toast<any>(element as Element<any>, options);
    if (this.value.length < this.maxToasts) {
      this.value.unshift(newToast as Toast<unknown>);
    } else {
      this.restOfToasts.unshift(newToast as Toast<unknown>);
    }
    return newToast;
  }

  filterOutGroup = (group: string): void => {
    this.restOfToasts = this.restOfToasts.filter((toast) => toast.id.description !== group);
    this.value = this.value.filter((toast) => toast.id.description !== group);
  };

  findToastByGroup = (group: string): Toast<unknown> | undefined => {
    return (
      this.value.find((toast) => toast.id.description === group) ??
      this.restOfToasts.find((toast) => toast.id.description === group)
    );
  };
}

export const toasts = new Toasts();
export type { Toast };
