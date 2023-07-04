import { getProducts } from 'lib/saleor';
import Grid from 'components/common/grid';

export default async function Products() {
  const products = await getProducts({ first: 30 });
  return (
    <div>
      <section className="flex flex-col justify-between gap-2 py-3 md:flex-row">
        <h1 className="text-2xl font-bold">Glasses for You!</h1>
        <div className="flex items-center gap-2">
          <Filters isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} />
          <SortBy />
          <button
            className={`flex items-center gap-1 rounded-md px-2 py-1  shadow-md hover:bg-[--primary-text-color] hover:text-white hover:shadow-lg ${
              isFilterOpen ? 'bg-[--primary-text-color] text-white' : ''
            }`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <BiFilter className="text-lg" />
            <span className="text-sm">Filters</span>
          </button>
        </div>
      </section>

      {productsList.length > 0 ? (
        <main className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {productsList.map((glass) => (
            <SingleProduct key={glass.id} product={glass} />
          ))}
        </main>
      ) : (
        <p className="w-full py-32  text-center font-sans  text-4xl font-bold uppercase tracking-wide text-gray-300">
          Nothing to Show!
        </p>
      )}
      <button
        className={` fixed bottom-10 right-2 rounded-full bg-gray-800 p-2 text-xl shadow-2xl transition-all delay-100 ease-in-out ${
          showScrollArrow ? 'block' : 'hidden'
        }`}
        onClick={scrollToTop}
      >
        <MdKeyboardArrowUp className=" text-white" />
      </button>
    </div>
  );
}
