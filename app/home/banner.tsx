'use client';

import Image from 'next/image';
import Link from 'next/link';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export default function BannerCarousel() {
  return (
    <div className="relative aspect-[5/5] w-full overflow-hidden md:aspect-[19/9] lg:aspect-[25/9]">
      <Carousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={4000}
        arrows={false}
        showDots={false}
        swipeable
        draggable
        ssr
        containerClass="h-full"
        itemClass="h-full"
      >
        <div className="relative aspect-[5/5] w-full md:aspect-[19/9] lg:aspect-[3/1]">
          <Image
            src="/banner3_pc.avif"
            alt="Banner 1"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="relative aspect-[5/5] w-full md:aspect-[19/9] lg:aspect-[25/9]">
          <Image
            src="/descuento_pc.avif"
            alt="Banner 2"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </Carousel>

      <div className="pointer-events-none absolute inset-0 z-10 grid h-full w-full grid-cols-2 grid-rows-3 gap-5 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-4">
        <div className="pointer-events-auto col-start-1 row-start-3 mx-5 my-8 flex items-center justify-center rounded bg-[#f7e7da] py-5 text-[15px] shadow-md md:col-span-1 md:col-start-1 md:row-start-2 md:mx-10 md:my-14 md:py-3 md:text-[18px] lg:h-[68px] lg:py-0">
          <Link href="/search">Ver catálogo</Link>
        </div>
      </div>
    </div>
  );
}
