import GridProducts from 'components/common/gridProducts';
import { getProducts } from 'lib/saleor';
import { ProductOrderField } from 'lib/saleor/generated/graphql';

export default async function TrendingList() {
  const products = await getProducts({ first: 8, sortKey: ProductOrderField.PublicationDate });
  return <GridProducts header="Nuevos productos" products={products} />;
}
