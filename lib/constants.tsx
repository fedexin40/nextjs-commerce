import { ProductOrderField } from './saleor/generated/graphql';

export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: ProductOrderField;
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: 'Tendencia',
  slug: 'trending-desc',
  sortKey: ProductOrderField.Rating,
  reverse: false
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: 'Lo mas nuevo',
    slug: 'latest-desc',
    sortKey: ProductOrderField.PublishedAt,
    reverse: true
  },
  {
    title: 'Precio: Menor a mayor',
    slug: 'price-asc',
    sortKey: ProductOrderField.MinimalPrice,
    reverse: false
  }, // asc
  {
    title: 'Precio: Mayor a menor',
    slug: 'price-desc',
    sortKey: ProductOrderField.MinimalPrice,
    reverse: true
  }
];

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Default Title';
