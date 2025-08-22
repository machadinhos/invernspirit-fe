import type { Cart as CartType, LineItem, Product } from '$types';
import { AsyncTaskQueue } from '$lib/utils/async-task-queue';
import { bffClient } from '$service';
import { ItemAddedToCartToast } from '$components-toasts';
import { page } from '$app/state';
import { toasts } from '$state';

class Cart {
  value: LineItem[] = $state([]);
  netPrice = 0;
  grossPrice = 0;
  size = $derived(this.value.reduce((sum, { quantity }) => sum + quantity, 0));
  isCheckoutPossible = $state(false);
  private beCallQueue = new AsyncTaskQueue();

  get idle(): Promise<void> {
    return this.beCallQueue.idle;
  }

  setCart(cart: CartType): void {
    const { products, isCheckoutPossible } = cart;
    this.value = products;
    this.isCheckoutPossible = isCheckoutPossible ?? true;
    this.netPrice = cart.netPrice;
    this.grossPrice = cart.grossPrice;
  }

  async updateProductQuantity(product: Product, newQuantity: number, pushToastOnQuantityUpdate = true): Promise<void> {
    await this.beCallQueue.enqueue(async () => {
      const cart = await bffClient.cart.updateItemQuantity(page.params.country, product.id, newQuantity);
      this.setCart(cart);
      if (!pushToastOnQuantityUpdate || page.url.pathname.endsWith('/cart')) return;
      toasts.push(ItemAddedToCartToast, { tag: 'cart-update' });
    });
  }

  async patchProductQuantity(
    product: Product,
    quantityDifference: number,
    pushToastOnQuantityUpdate = true,
  ): Promise<void> {
    await this.beCallQueue.enqueue(async () => {
      const cart = await bffClient.cart.patchItemQuantity(page.params.country, product.id, quantityDifference);
      this.setCart(cart);
      if (!pushToastOnQuantityUpdate || page.url.pathname.endsWith('/cart')) return;
      toasts.push(ItemAddedToCartToast, { tag: 'cart-update' });
    });
  }

  async removeProduct(product: Product): Promise<void> {
    await this.beCallQueue.enqueue(async () => {
      this.setCart(await bffClient.cart.removeItem(page.params.country, product.id));
    });
  }

  getProductQuantity(productId: string): number {
    return this.value.find(({ id }) => id === productId)?.quantity ?? 0;
  }
}

export const cart = new Cart();
