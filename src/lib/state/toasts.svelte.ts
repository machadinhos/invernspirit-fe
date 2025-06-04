import type { Component } from 'svelte';

type BaseToastOptions = {
  duration?: number;
  pauseTimeOnHover?: boolean;
  hasRemainingTimeLine?: boolean;
  hasCloseButton?: boolean;
  type?: 'normal' | 'error' | 'success';
  group?: string;
  singleton?: boolean;
};

type ToastOptions<ExtraParams> = BaseToastOptions & {
  extraParams: ExtraParams;
};

type Element<Params extends Record<string, unknown>> =
  | Component<Params & { toast: Toast<Params> }, Record<never, never>>
  | Component<Params, Record<never, never>>;
type NoExtraParamsElement =
  | Component<{ toast: Toast }, Record<never, never>>
  | Component<Record<never, never>, Record<never, never>>;

class Toast<Params extends Record<string, unknown> | undefined = undefined> {
  remainingTime = $state() as number | null;
  timeoutId: ReturnType<typeof setTimeout> | undefined = $state();
  lastTime: number | undefined = $state();
  intervalId: ReturnType<typeof setInterval> | undefined = $state();
  progress = $state(100);

  declare readonly hasCloseButton: boolean;
  declare readonly duration: number | null;
  declare readonly pauseTimeOnHover: boolean;
  declare readonly hasRemainingTimeLine: boolean;
  declare readonly element: Params extends Record<string, unknown> ? Element<Params> : NoExtraParamsElement;
  declare readonly extraParams: Params;
  declare readonly id: symbol;
  declare readonly destroy: () => void;
  declare readonly type: 'normal' | 'error' | 'success';
  declare readonly singleton: boolean;

  constructor(
    element: Params extends Record<string, unknown> ? Element<Params> : NoExtraParamsElement,
    {
      pauseTimeOnHover = true,
      hasRemainingTimeLine = true,
      hasCloseButton = true,
      duration = 4000,
      type = 'normal',
      group,
      singleton = false,
      ...rest
    }: Params extends never ? BaseToastOptions : ToastOptions<Params>,
  ) {
    this.extraParams = ('extraParams' in rest ? rest.extraParams : undefined) as Params;
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
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  value: Toast<any>[] = $state([]);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  private restOfToasts: Toast<any>[] = [];
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

  push(element: NoExtraParamsElement, options?: BaseToastOptions): Toast;
  push<Params extends Record<string, unknown>>(element: Element<Params>, options: ToastOptions<Params>): Toast<Params>;
  push<Params extends Record<string, unknown> | undefined>(
    element: Params extends Record<string, unknown> ? Element<Params> : NoExtraParamsElement,
    options: BaseToastOptions | ToastOptions<Params> = {},
  ): Toast<Params | undefined> {
    if (options?.singleton && options.group !== undefined) {
      const existingToast = this.findToastByGroup(options.group);
      if (existingToast) {
        existingToast.resetTimer();
        return existingToast as Toast<Params | undefined>;
      }
    }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const newToast = new Toast<any>(element as Element<any>, options);
    if (this.value.length < this.maxToasts) {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      this.value.unshift(newToast as Toast<any>);
    } else {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      this.restOfToasts.unshift(newToast as Toast<any>);
    }
    return newToast;
  }

  filterOutGroup = (group: string): void => {
    this.restOfToasts = this.restOfToasts.filter((toast) => toast.id.description !== group);
    this.value = this.value.filter((toast) => toast.id.description !== group);
  };

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  findToastByGroup = (group: string): Toast<any> | undefined => {
    return (
      this.value.find((toast) => toast.id.description === group) ??
      this.restOfToasts.find((toast) => toast.id.description === group)
    );
  };
}

export const toasts = new Toasts();
export type { Toast };
