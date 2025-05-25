import type { Cart } from './cart';
import type { User } from './user';

export type StageName = 'address' | 'personal-details' | 'shipping' | 'review';

export type CheckoutStage = {
  name: StageName;
  title: string;
  isEnabled: boolean;
};

export type Address = {
  street: string;
  houseNumber: string;
  apartment?: string;
  postalCode: string;
  city: string;
  province?: string;
};

export type ExtendedAddress = Address & {
  country: string;
};

export type ShippingMethod = {
  id: string;
  name: string;
  rate: {
    priceInCents: number;
    minWeight: number;
    maxWeight: number;
    deliveryTime: number;
    countryCodes: string[];
  };
};

type ReviewSection = { isEditable: boolean };

export type Review = {
  shippingMethod: ShippingMethod & ReviewSection;
  personalDetails: User & ReviewSection;
  address: Address & ReviewSection;
  cart: Cart;
  totalPrice: number;
};
