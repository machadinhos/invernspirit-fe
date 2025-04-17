import type { LineItem } from '$lib/types/line-item';
import type { UserDetails } from './user';

export type Config = {
  user?: UserDetails;
  cart: {
    products: LineItem[];
  };
};
