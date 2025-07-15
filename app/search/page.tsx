import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import FilterList from 'components/layout/search/filter';
import LoadMore from 'components/load-more/page';
import NotFound from 'components/product/not-found';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/saleor';

export const runtime = 'edge';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.',
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const first = 24;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const productsPagination = await getProducts({
    sortKey,
    reverse,
    query: searchValue,
    first: first,
  });
  const products = productsPagination.products;
  const totalCount = productsPagination.totalCount;
  const numbersOfPages = Math.ceil(totalCount / first) - 1;

  return (
    <>
      {products.length > 0 ? (
        <div className="mx-10 mb-24 lg:mx-32 lg:mb-40">
          <div className="flex w-full flex-row-reverse pb-12 pt-12">
            <div>
              <FilterList list={sorting} />
            </div>
          </div>
          <Grid className="grid-cols-2 gap-y-24 md:grid-cols-3 lg:grid-cols-4 xl:gap-y-40">
            <ProductGridItems products={products} />
          </Grid>
        </div>
      ) : (
        <NotFound query={searchValue || ''} />
      )}
      {productsPagination.hasNextPage && (
        <div className="pt-2 lg:pt-0">
          <LoadMore
            numbersOfPages={numbersOfPages}
            endCursor={productsPagination.endCursor}
            startCursor={productsPagination.startCursor}
            first={first}
            collection={'oro'}
            query={searchValue || undefined}
            fromSearch={true}
            sortKey={sortKey}
            reverse={reverse}
          />
        </div>
      )}
    </>
  );
}
