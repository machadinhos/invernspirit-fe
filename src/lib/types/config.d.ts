import type { LineItem } from '$lib/types/line-item';
import type { User } from './user';

export type Config = {
  user?: User;
  cart: {
    products: LineItem[];
  };
};
