import type { Product } from './product';

export type Cart = {
  netPrice: number;
  grossPrice: number;
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
