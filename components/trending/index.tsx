import Grid from '../common/grid';
import { getProducts } from 'lib/saleor';

export default async function TrendingList() {
  const products = await getProducts({ first: 7 });
  return (
    <section className="xs:grid-cols-2  mt-10 grid grid-cols-1   gap-4 py-4  md:grid-cols-3 lg:grid-cols-4">
      <h1 className="flex items-center break-words  text-3xl md:text-4xl lg:text-5xl ">
        Productos mas vendidos
      </h1>

      {products.map((product) => (
        <Grid key={product.handle} product={product} />
      ))}
    </section>
  );
}
