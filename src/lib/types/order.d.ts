import type { ExtendedAddress, ShippingMethod } from '$lib/types/checkout';
import type { LineItem } from '$lib/types/cart';
import type { User } from '$lib/types/user';

export type OrderStatus = 'processing_payment' | 'packaging' | 'shipping' | 'completed' | 'canceled' | 'error';

export type Order = {
  id: string;
  status: OrderStatus;
  createdAt: string;
  address: ExtendedAddress;
  personalDetails: User;
  shippingMethod: ShippingMethod;
  products: LineItem[];
  payment: {
    createdAt: string;
    type: string;
    state: string;
    netAmount: number;
    grossAmount: number;
    paymentMethod?: {
      type: 'card' | 'paypal';
      brand?: string;
      last4?: string;
    };
  };
  shippingTransaction: {
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    trackingUrl?: string;
  };
  taxes: {
    name: string;
    rate: number;
    amount: number;
  }[];
  currency: {
    code: string;
    name: string;
    symbol: string;
    stripeName: string;
  };
};
