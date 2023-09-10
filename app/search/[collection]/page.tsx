import GridProducts from 'components/common/gridProducts';
import CategoryMenu from 'components/layout/navbar/category';
import FilterItemDropdown from 'components/layout/search/filter/dropdown';
import { defaultSort, sorting } from 'lib/constants';
import { getCollection, getCollectionProducts } from 'lib/saleor';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { collection: string };
};

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { collection: string };
}): Promise<Metadata> {
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description || collection.description || `${collection.title} products`,
    openGraph: {
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(collection.title)}`,
          width: 1200,
          height: 630
        }
      ]
    }
  };
}

export default async function CategoryPage(props: Props) {
  const { sort } = props.searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getCollectionProducts({ sortKey, reverse, slug: props.params.collection });

  if (products.length === 0) {
    redirect('/noProduct');
  }

  return (
    <>
      <div className="tracking-widejustify-normal flex w-full flex-row place-content-around rounded-lg bg-blue-700 pb-3 pt-5 text-base text-white shadow-lg shadow-black">
        <FilterItemDropdown list={sorting} />
        <CategoryMenu />
      </div>
      <section>
        <GridProducts products={products} />
      </section>
    </>
  );
}
