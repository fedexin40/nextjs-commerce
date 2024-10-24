import { getCollection, getCollectionProducts } from 'lib/saleor';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import FilterList from 'components/layout/search/filter';
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
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const productsByPage = await getCollectionProducts({
    collection: params.collection,
    sortKey,
    reverse,
  });
  const products = productsByPage.products;

  return (
    <>
      {products.length > 0 ? (
        <div className="mx-10 mb-24 lg:mx-32 lg:mb-40">
          <div className="flex w-full flex-row-reverse pb-12 pt-12">
            <div>
              <FilterList list={sorting} />
            </div>
          </div>
          <Grid className="grid-cols-1 gap-y-24 md:grid-cols-3 lg:grid-cols-4 xl:gap-y-40">
            <ProductGridItems products={products} />
          </Grid>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
