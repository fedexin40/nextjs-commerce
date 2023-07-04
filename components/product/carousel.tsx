'use client';

import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import { Product } from 'lib/types';
import Link from 'next/link';
import Carousel from 'better-react-carousel';
import useScreenType from 'react-screentype-hook';

export default function CarouselProduct({ products }: { products: Product[] }) {
  const screenType = useScreenType();
  let rows;
  if (screenType.isDesktop == true || screenType.isLargeDesktop == true) {
    rows = 4;
  } else if (screenType.isTablet == true) {
    rows = 2;
  } else {
    rows = 1;
  }
  return (
    <div className="grid">
      {/* @ts-expect-error Server Component */}
      <Carousel cols={rows} rows={1} gap={1} scrollSnap={true} loop>
        {products.map((product: Product) => (
          <Carousel.Item key={product.handle}>
            <Grid.Item key={product.handle} className="animate-fadeIn">
              <Link className="h-full w-full" href={`/product/${product.handle}`}>
                <GridTileImage
                  alt={product.title}
                  src={product.featuredImage?.url}
                  width={600}
                  height={600}
                  labels={{
                    title: product.title as string,
                    amount: product.priceRange.maxVariantPrice.amount,
                    currencyCode: product.priceRange.maxVariantPrice.currencyCode
                  }}
                />
              </Link>
            </Grid.Item>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}
