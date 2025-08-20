import type { Cart } from './cart';
import type { UserDetails } from './user';

export type Config = {
  user?: UserDetails;
  userId?: string;
  cart: Cart;
};
