import type { Product } from '$lib/types/product';

export type Cart = {
  issues?: string[];
  products: LineItem[];
  isCheckoutPossible?: boolean;
};

export type LineItem = {
  quantity: number;
  issues?: {
    message: string;
    type: 'NOT_ENOUGH_STOCK';
  }[];
} & Product;
