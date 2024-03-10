import { ProductOrderField } from './saleor/generated/graphql';

export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: ProductOrderField;
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: 'Mas vendidos',
  slug: 'trending-desc',
  sortKey: ProductOrderField.Rating,
  reverse: false,
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: 'Mas nuevos',
    slug: 'latest-desc',
    sortKey: ProductOrderField.PublishedAt,
    reverse: true,
  },
  {
    title: 'Mas baratos primero',
    slug: 'price-asc',
    sortKey: ProductOrderField.MinimalPrice,
    reverse: false,
  }, // asc
  {
    title: 'Mas caros primero',
    slug: 'price-desc',
    sortKey: ProductOrderField.MinimalPrice,
    reverse: true,
  },
];

export const TAGS = {
  collections: 'collections',
  products: 'products',
};

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Default Title';
