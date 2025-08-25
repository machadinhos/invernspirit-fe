import type { Component } from 'svelte';

type BaseModalOptions = {
  closeOnNavigate?: boolean;
};

type ModalOptions<ExtraParams> = BaseModalOptions & {
  extraParams: Omit<ExtraParams, 'modal'>;
};

type Element<Params extends Record<string, unknown>> =
  | Component<Params & { modal: ModalInstance<Params> }, Record<never, never>>
  | Component<Params, Record<never, never>>;
type NoExtraParamsElement =
  | Component<{ modal: ModalInstance }, Record<never, never>>
  | Component<Record<never, never>, Record<never, never>>;

class ModalInstance<Params extends Record<string, unknown> | undefined = undefined> {
  readonly element: Params extends Record<string, unknown> ? Element<Params> : NoExtraParamsElement;
  readonly closeOnNavigate: boolean;
  readonly extraParams: NoInfer<Omit<Params, 'modal'>>;
  readonly close: () => void;
  readonly id: symbol;

  constructor(
    element: Params extends Record<string, unknown> ? Element<Params> : NoExtraParamsElement,
    { closeOnNavigate = true, ...rest }: Params extends never ? BaseModalOptions : ModalOptions<Params>,
  ) {
    this.id = Symbol();
    this.element = element;
    this.extraParams = ('extraParams' in rest ? rest.extraParams : undefined) as Params;
    this.closeOnNavigate = closeOnNavigate;

    this.close = modal.generateCloseFunction(this.id);
  }
}

class Modal {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  value: ModalInstance<any> | undefined = $state();
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  private queue: ModalInstance<any>[] = [];

  private setValueFromQueue(): void {
    this.value ??= this.queue.shift();
  }

  generateCloseFunction(id: symbol): () => void {
    return (): void => {
      if (this.value?.id === id) {
        this.value = undefined;
        this.setValueFromQueue();
      } else {
        this.queue = this.queue.filter((modal) => modal.id !== id);
      }
    };
  }

  open(element: NoExtraParamsElement, options?: BaseModalOptions): ModalInstance;
  open<Params extends Record<string, unknown>>(
    element: Element<Params>,
    options: ModalOptions<NoInfer<Params>>,
  ): ModalInstance<Params>;
  open<Params extends Record<string, unknown> | undefined>(
    element: Params extends Record<string, unknown> ? Element<Params> : NoExtraParamsElement,
    options: BaseModalOptions | ModalOptions<NoInfer<Params>> = {},
  ): ModalInstance<Params | undefined> {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const modalInstance = new ModalInstance(element, options as any);
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
