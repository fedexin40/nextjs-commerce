'use client';

import { GridTileImage } from 'components/grid/tile';
import { Product } from 'lib/types';
// Import Swiper React components
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function CarouselProduct({ products }: { products: Product[] }) {
  return (
    <div className="grid w-full grid-rows-1">
      <Swiper
        slidesPerView={'auto'}
        centeredSlides={true}
        pagination={{
          clickable: true
        }}
        modules={[Pagination]}
      >
        {products.map((product: Product) => (
          <SwiperSlide>
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
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
