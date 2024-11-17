'use server';

import { getCollectionProducts, getProducts as getProductsFunction } from 'lib/saleor';
import { ProductOrderField } from 'lib/saleor/generated/graphql';
import { ProductsByPage } from 'lib/types';

export async function loadProducts({
  endCursor,
  first,
  reverse,
  sortKey,
  collection,
  query,
}: {
  first: number;
  endCursor: string;
  reverse?: boolean;
  sortKey?: ProductOrderField;
  query?: string;
  collection?: string;
}): Promise<ProductsByPage> {
  let productsPagination;
  try {
    if (query) {
      productsPagination = await getProductsFunction({
        cursor: endCursor,
        first: first || 100,
        sortKey: sortKey,
        reverse: reverse,
        query: query,
      });
    } else {
      productsPagination = await getCollectionProducts({
        cursor: endCursor,
        first: first || 100,
        sortKey: sortKey,
        reverse: reverse,
        collection: collection || '',
      });
    }
  } catch (error: any) {
    return error.message;
  }
  return productsPagination;
}
