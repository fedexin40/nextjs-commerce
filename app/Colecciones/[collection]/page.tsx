import { getCollection, getCollectionProducts } from 'lib/saleor';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import FilterList from 'components/layout/search/filter';
import LoadMore from 'components/load-more/page';
import { defaultSort, sorting } from 'lib/constants';

export const runtime = 'edge';

export async function generateMetadata({
  params,
}: {
  params: { collection: string };
}): Promise<Metadata> {
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description || collection.description || `${collection.title} products`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { collection: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const first = 24;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const getProductsByCollection = {
    first: first,
    collection: params.collection,
    reverse: reverse,
    sortKey: sortKey,
  };
  const productsByPage = await getCollectionProducts(getProductsByCollection);
  const products = productsByPage.products;
  const totalCount = productsByPage.totalCount;
  const numbersOfPages = Math.ceil(totalCount / first) - 1;

  return (
    <>
      {products.length > 0 && (
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
      )}
      {productsByPage.hasNextPage && (
        <div className="pt-2 lg:pt-0">
          <LoadMore
            numbersOfPages={numbersOfPages}
            endCursor={productsByPage.endCursor}
            startCursor={productsByPage.startCursor}
            first={first}
            reverse={reverse}
            sortKey={sortKey}
            collection={params.collection}
          />
        </div>
      )}
    </>
  );
}
