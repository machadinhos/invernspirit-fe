import { generateUniqueId } from '$lib/utils/general';
import type { Snippet } from 'svelte';

type Element<T> = Snippet<[ModalInstance<T>, T]>;

class ModalInstance<T = void> {
  readonly element: Element<T>;
  readonly extraParams?: T;
  readonly close: () => void;
  readonly id: string;

  constructor(element: Element<T>, extraParams?: T) {
    this.id = generateUniqueId();
    this.element = element;
    this.extraParams = extraParams;
    this.close = modal.generateCloseFunction(this.id);
  }
}

class Modal {
  value: ModalInstance<unknown> | undefined = $state();
  private queue: ModalInstance<unknown>[] = [];

  private setValueFromQueue = (): void => {
    if (this.queue.length > 0 && !this.value) this.value = this.queue.shift();
  };

  generateCloseFunction = (id: string): (() => void) => {
    return (): void => {
      if (this.value?.id === id) {
        this.value = undefined;
        this.setValueFromQueue();
      } else {
        this.queue = this.queue.filter((modal) => modal.id !== id);
      }
    };
  };

  open = <T = void>(element: Element<T>, extraParams?: T): ModalInstance<T> => {
    const modalInstance = new ModalInstance<T>(element, extraParams);
    if (this.value) {
      this.queue.push(modalInstance as ModalInstance<unknown>);
    } else {
      this.value = modalInstance as ModalInstance<unknown>;
    }
    return modalInstance;
  };
}

export const modal = new Modal();
export type { ModalInstance };
