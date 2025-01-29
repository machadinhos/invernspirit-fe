import { PUBLIC_STOCK_BUCKET_HOST } from '$env/static/public';
import type { StockBucket } from '$types';

export const getStockFromBucket = async (productId: string): Promise<StockBucket> => {
  return (await fetch(`${PUBLIC_STOCK_BUCKET_HOST}/${productId}`)).json();
};
