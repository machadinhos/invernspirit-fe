import type { Image, Taxes } from '$types';

export type Product = {
  id: string;
  name: string;
  description: string;
  stock: number;
  weight: number;
  collection: { id: string; name: string };
  grossPrice: number;
  netPrice: number;
  images: Image[];
  taxes: Taxes[];
};

export type StockBucket = {
  data: number;
};
