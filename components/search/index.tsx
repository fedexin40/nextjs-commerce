import { getCategories, getCollections } from 'lib/saleor';
import { Category } from 'lib/types';
import { default as SearchModal } from './categories-client';

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export default async function Categories() {
  const saleorUrl = new URL(baseUrl!);
  saleorUrl.pathname = '/search';

  var categories = (await getCategories()).filter(
    (category: Category) => category.parent.level == 0,
  );
  var collections = await getCollections();
  categories = [
    ...categories,
    {
      name: 'Todos',
      slug: 'all',
      parent: {},
      url: saleorUrl.toString(),
    },
  ];

  return (
    <div>
      <SearchModal categories={categories} collections={collections} />
    </div>
  );
}
