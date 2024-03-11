import { getCategories } from 'lib/saleor';
import { Category } from 'lib/types';
import MenuDropdown from './dropdown-menu';

export default async function Menu() {
  const categories = (await getCategories()).filter(
    (category: Category) => category.parent.level == 0,
  );
  return (
    <>
      <MenuDropdown categories={categories} />
    </>
  );
}
