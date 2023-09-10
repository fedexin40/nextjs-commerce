import { Product } from 'lib/types';
import Grid from '../common/grid';

export default function GridProducts({
  header,
  products
}: {
  header?: String;
  products: Product[];
}) {
  return (
    <>
      {header ? <h1 className="flex break-words text-3xl md:text-4xl">{header}</h1> : null}
      <section className="grid grid-cols-4 grid-rows-2 gap-x-2 gap-y-6">
        {products.map((product) => (
          <Grid key={product.handle} product={product} />
        ))}
      </section>
    </>
  );
}
