type OpenGraphBase = {
  title: string;
  description: string;
  image: string;
};

type OpenGraphGeneric = {
  type: 'website' | 'product';
} & OpenGraphBase;

type OpenGraphProductGroup = {
  type: 'product.group';
  'product:item_group_id': string;
} & OpenGraphBase;

type OpenGraphProductItem = {
  type: 'product.item';
  'product:item_group_id': string;
  'product:retailer_item_id': string;
  'product:price:amount': string;
  'product:price:currency': string;
  'product:condition': 'new';
} & OpenGraphBase;

type OpenGraph = OpenGraphGeneric | OpenGraphProductGroup | OpenGraphProductItem;

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    /* eslint-disable-next-line @typescript-eslint/consistent-type-definitions */
    interface PageData {
      noCrawl?: boolean;
      openGraph?: OpenGraph;
      hideSearchBarOnMobile?: boolean;
    }
    // interface PageState {}
    // interface Platform {};
  }
}

export {};
