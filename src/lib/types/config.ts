import type { LineItem } from './cart';
import type { UserDetails } from './user';

export type Config = {
  user?: UserDetails;
  cart: {
    products: LineItem[];
  };
};
