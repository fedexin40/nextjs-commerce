import CategoryCard from './CategoryCard';

const CategoryList = ({ catRef }) => {
  const categoryList = await getProducts({ first: 7, sortKey: 'PUBLICATION_DATE' });
  return (
    <>
      <h1 className="mt-10 break-words  text-center text-3xl md:text-4xl">Categorias</h1>
      <section className="mt-1  grid  grid-cols-1    gap-4  py-4 md:grid-cols-3" ref={catRef}>
        {categoryList.map((categoryItem) => (
          <CategoryCard key={categoryItem._id} category={categoryItem} />
        ))}
      </section>
    </>
  );
};

export default CategoryList;
