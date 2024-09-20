import { getCategories } from 'lib/saleor';
import { Category } from 'lib/types';
import MenuDropdown from './dropdown-menu';

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export default async function Menu() {
  const saleorUrl = new URL(baseUrl!);
  saleorUrl.pathname = '/search';

  var categories = (await getCategories()).filter(
    (category: Category) => category.parent.level == 0,
  );
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
      <MenuDropdown categories={categories} />
    </div>
  );
}
