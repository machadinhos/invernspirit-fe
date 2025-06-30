import { bffClient } from '$service';
import { cart } from './cart.svelte';
import { page } from '$app/state';
import { PUBLIC_GOOGLE_ANALYTICS_ID } from '$env/static/public';
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

  async init(searchParams: URLSearchParams): Promise<void> {
    const configHeaders = searchParams.get('after-checkout') === 'true' ? { 'after-checkout': 'true' } : undefined;
    const config = await bffClient.config.get(page.params.country, configHeaders);
    cart.setCart(config.cart);
    user.value = config.user;
    this.completeInitialization();
    this.isInitialized = true;
    if (user.value) {
      gtag('config', PUBLIC_GOOGLE_ANALYTICS_ID, {
        user_id: user.value.id,
      });
    } else {
      gtag('config', PUBLIC_GOOGLE_ANALYTICS_ID);
    }
  }

  async afterInitialization<Result>(callback: () => Result): Promise<Result> {
    await this.initializationPromise;
    return callback();
  }
}

export const config = new Config();
