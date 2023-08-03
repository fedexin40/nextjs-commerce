import { GetCategories } from 'lib/saleor/';
import CategoryCard from './CategoryCard';

export default async function CategoryList() {
  const categoryList = await GetCategories({ first: 3 });

  return (
    <>
      <h1 id="categories_section" className="mt-10 break-words  text-center text-3xl md:text-4xl">
        Categories
      </h1>
      <section className="mt-1 grid grid-cols-1 gap-4 py-4 md:grid-cols-3">
        {categoryList.map((categoryItem) => (
          <CategoryCard category={categoryItem} />
        ))}
      </section>
    </>
  );
}
