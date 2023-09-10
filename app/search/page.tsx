import GridProducts from 'components/common/gridProducts';
import CategoryMenu from 'components/layout/navbar/category';
import FilterItemDropdown from 'components/layout/search/filter/dropdown';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/saleor';
import { redirect } from 'next/navigation';

export const runtime = 'edge';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });

  if (products.length === 0) {
    redirect('/noProduct');
  }

  return (
    <>
      <div className="tracking-widejustify-normal grid w-full grid-cols-2 rounded-lg bg-blue-500 pb-1 pt-4 text-center text-base text-white shadow-md drop-shadow-md">
        <FilterItemDropdown list={sorting} />
        <CategoryMenu />
      </div>
      {products.length > 0 ? <GridProducts products={products} /> : null}
    </>
  );
}
