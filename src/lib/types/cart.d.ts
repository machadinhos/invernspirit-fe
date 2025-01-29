import type { Product } from '$lib/types/product';

export type Cart = {
  products: LineItem[];
  isCheckoutPossible?: boolean;
};

export type LineItem = {
  quantity: number;
  errors?: {
    type: string;
    message: 'NOT_ENOUGH_STOCK';
  }[];
} & Product;
