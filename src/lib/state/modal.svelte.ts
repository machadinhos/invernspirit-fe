import type { Component } from 'svelte';

type Element<Params extends Record<string, unknown>> =
  | Component<Params & { modal: ModalInstance<Params> }, Record<never, never>>
  | Component<Params, Record<never, never>>;
type NoExtraParamsElement =
  | Component<{ modal: ModalInstance }, Record<never, never>>
  | Component<Record<never, never>, Record<never, never>>;

class ModalInstance<Params extends Record<string, unknown> | undefined = undefined> {
  readonly element: Params extends Record<string, unknown> ? Element<Params> : NoExtraParamsElement;
  readonly extraParams: Params;
  readonly close: () => void;
  readonly id: symbol;

  constructor(
    element: Params extends Record<string, unknown> ? Element<Params> : NoExtraParamsElement,
    extraParams: Params,
  ) {
    this.id = Symbol();
    this.element = element;
    this.extraParams = extraParams;
    this.close = modal.generateCloseFunction(this.id);
  }
}

class Modal {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  value: ModalInstance<any> | undefined = $state();
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  private queue: ModalInstance<any>[] = [];

  private setValueFromQueue = (): void => {
    if (this.queue.length > 0 && !this.value) this.value = this.queue.shift();
  };

  generateCloseFunction = (id: symbol): (() => void) => {
    return (): void => {
      if (this.value?.id === id) {
        this.value = undefined;
        this.setValueFromQueue();
      } else {
        this.queue = this.queue.filter((modal) => modal.id !== id);
      }
    };
  };

  open(element: NoExtraParamsElement): ModalInstance;
  open<Params extends Record<string, unknown>>(element: Element<Params>, extraParams: Params): ModalInstance<Params>;
  open<Params extends Record<string, unknown> | undefined>(
    element: Params extends Record<string, unknown> ? Element<Params> : NoExtraParamsElement,
    extraParams?: Params,
  ): ModalInstance<Params> | ModalInstance {
    const modalInstance = new ModalInstance(element, extraParams);
    if (this.value) {
      this.queue.push(modalInstance);
    } else {
      this.value = modalInstance;
    }
    return modalInstance as ModalInstance<Params> | ModalInstance;
  }
}

export const modal = new Modal();
export type { ModalInstance };
