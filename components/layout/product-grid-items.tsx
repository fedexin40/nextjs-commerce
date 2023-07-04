import Grid from 'components/common/grid';
import { Product } from 'lib/types';

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <>
      {products.map((product) => (
        <Grid key={product.handle} product={product} />
      ))}
    </>
  );
}
