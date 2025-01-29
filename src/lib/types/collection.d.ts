import type { Image, Product } from '$types';

type BaseCollection = {
  id: string;
  name: string;
  description: string;
};

export type Collection = {
  image: Image;
} & BaseCollection;

export type CollectionDetails = {
  products: Product[];
} & BaseCollection;
