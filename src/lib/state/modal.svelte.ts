import type { Component } from 'svelte';
import { page } from '$app/state';
import { pushState } from '$app/navigation';

type Element<Params extends Record<string, unknown>> =
  | Component<Params & { modal: ModalInstance<Params> }, Record<never, never>>
  | Component<Params, Record<never, never>>;
type NoExtraParamsElement =
  | Component<{ modal: ModalInstance }, Record<never, never>>
  | Component<Record<never, never>, Record<never, never>>;

class ModalInstance<Params extends Record<string, unknown> | undefined = undefined> {
  readonly element: Params extends Record<string, unknown> ? Element<Params> : NoExtraParamsElement;
  readonly extraParams: NoInfer<Omit<Params, 'modal'>>;
  readonly close: () => void;
  readonly id: symbol;

  constructor(
    element: Params extends Record<string, unknown> ? Element<Params> : NoExtraParamsElement,
    extraParams: NoInfer<Omit<Params, 'modal'>>,
  ) {
    this.id = Symbol(crypto.randomUUID());
    this.element = element;
    this.extraParams = extraParams;
    this.close = modal.generateCloseFunction(this.id);
  }
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type GenericModalInstance = ModalInstance<any>;

class Modal {
  _value: GenericModalInstance | undefined = $state();

  private queue: GenericModalInstance[] = [];

  private set value(modal: GenericModalInstance | undefined) {
    this._value = modal;
    pushState('', {
      openedModal: modal?.id.toString(),
    });
  }

  get value(): GenericModalInstance | undefined {
    return this._value;
  }

  constructor() {
    $effect.root(() => {
      $effect(() => {
        if (page.state.openedModal === undefined) {
          this.value?.close();
        }
      });
    });
  }

  private setValueFromQueue(): void {
    if (this.value) return;
    const modal = this.queue.shift();
    if (modal) this.value = modal;
  }

  generateCloseFunction(id: symbol): () => void {
    return (): void => {
      if (this.value?.id === id) {
        if (page.state.openedModal === id.toString()) {
          history.back();
          return;
        }
        this.value = undefined;
        this.setValueFromQueue();
      } else {
        this.queue = this.queue.filter((modal) => modal.id !== id);
      }
    };
  }

  open(element: NoExtraParamsElement): ModalInstance;
  open<Params extends Record<string, unknown>>(
    element: Element<Params>,
    extraParams: NoInfer<Omit<Params, 'modal'>>,
  ): ModalInstance<Params>;
  open<Params extends Record<string, unknown> | undefined>(
    element: Params extends Record<string, unknown> ? Element<Params> : NoExtraParamsElement,
    extraParams?: NoInfer<Omit<Params, 'modal'>>,
  ): ModalInstance<Params> | ModalInstance {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const modalInstance = new ModalInstance(element, extraParams as any);
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
