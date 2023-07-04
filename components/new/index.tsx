import Grid from '../common/grid';
import { getProducts } from 'lib/saleor';
import { ProductOrderField } from 'lib/saleor/generated/graphql';

export default async function TrendingList() {
  const products = await getProducts({ first: 7, sortKey: ProductOrderField.PublicationDate });
  return (
    <section className="xs:grid-cols-2 mt-10 grid grid-cols-1 gap-10  py-4 pt-16  md:grid-cols-3 lg:grid-cols-4">
      <h1 className="flex items-center break-words  text-3xl md:text-4xl lg:text-5xl ">
        Nuevos Productos
      </h1>

      {products.map((product) => (
        <Grid key={product.handle} product={product} />
      ))}
    </section>
  );
}
