import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import { Product } from 'lib/types';
import Link from 'next/link';

export default function ProductGridItems({ products }: { products: Product[] }) {
  return <>{products.map((product) => Variants({ product }))}</>;
}

function Variants({ product }: { product: Product }) {
  const availableVariants = product.variants
    .filter((variant) => variant.quantityAvailable > 0)
    .sort((a: any, b: any) => a.price.amount - b.price.amount);
  if (availableVariants.length > 1) {
    return (
      <Grid.Item key={product.handle} className="animate-fadeIn">
        <Link
          className="relative inline-block h-full w-full"
          href={`/Colecciones/${product.featureCollection?.slug}/${product.handle}`}
        >
          <GridTileImage
            alt={product.title}
            label={{
              title: product.title,
              category: product.category.name,
              amountMax: availableVariants[availableVariants.length - 1]?.price.amount || '00.00',
              amountMin: availableVariants[0]?.price.amount || '00.00',
              currencyCode: product.priceRange.minVariantPrice.currencyCode,
              discount: product.discount.amount || '0',
            }}
            src={product.featuredImage?.url}
            fill
            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </Link>
      </Grid.Item>
    );
  } else {
    return (
      <Grid.Item key={product.handle} className="animate-fadeIn">
        <Link
          className="relative inline-block h-full w-full"
          href={`/Colecciones/${product.featureCollection?.slug}/${product.handle}`}
        >
          <GridTileImage
            alt={product.title}
            label={{
              title: product.title,
              category: product.category.name,
              amountMax: availableVariants[availableVariants.length - 1]?.price.amount || '00.00',
              amountMin: availableVariants[availableVariants.length - 1]?.price.amount || '00.00',
              currencyCode: product.priceRange.minVariantPrice.currencyCode,
              discount: product.discount.amount || '0',
            }}
            src={product.featuredImage?.url}
            fill
            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </Link>
      </Grid.Item>
    );
  }
}
