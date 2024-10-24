'use server';

import { getCollectionProducts } from 'lib/saleor';
import { ProductsByPage } from 'lib/types';

export async function loadProducts({
  first,
  cursor,
  collection,
}: {
  first: number;
  cursor: string;
  collection: string;
}): Promise<ProductsByPage> {
  let productsPagination;
  try {
    productsPagination = await getCollectionProducts({
      cursor: cursor,
      first: first || 100,
      collection: collection,
    });
  } catch (error: any) {
    return error.message;
  }
  return productsPagination;
}
