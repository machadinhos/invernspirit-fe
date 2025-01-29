import { bffClient } from '$service';
import { cart } from './cart.svelte';
import { page } from '$app/state';
import { user } from './user.svelte';

class Config {
  private readonly initializationPromise: Promise<void>;
  private completeInitialization!: () => void;
  isInitialized = $state(false);

  constructor() {
    this.initializationPromise = new Promise((resolve) => {
      this.completeInitialization = resolve;
    });
  }

  init = async (searchParams: URLSearchParams): Promise<void> => {
    const afterCheckout = searchParams.get('after-checkout') === 'true' ? 'true' : undefined;
    const headers = {
      ...(afterCheckout && { 'after-checkout': afterCheckout }),
    };
    const config = await bffClient.config.get(page.params.country, headers);
    cart.setCart(config.cart);
    user.value = config.user;
    this.completeInitialization();
    this.isInitialized = true;
  };

  afterInitialization = async <T>(callback: () => T): Promise<T> => {
    await this.initializationPromise;
    return callback();
  };
}

export const config = new Config();
