import GridProducts from 'components/common/gridProducts';
import { getProducts } from 'lib/saleor';

export default async function TrendingList() {
  const products = await getProducts({ first: 7 });
  return <GridProducts header="Productos mas Vendidos" products={products} />;
}
