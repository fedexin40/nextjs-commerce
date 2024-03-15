'use client';

import { Suspense } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Principal, { EnvioGratis, EnvioGratisMobil, PrincipalMobil } from './carousel';

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
  },
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

export default function CarouselComponent() {
  return (
    <>
      <div className="hidden md:block">
        <Suspense
          fallback={
            <div className="flex h-36 w-full animate-pulse bg-gray-200 md:h-64 lg:h-96"></div>
          }
        >
          <Carousel
            showDots={false}
            responsive={responsive}
            infinite={true}
            removeArrowOnDeviceType={['desktop', 'tablet', 'mobile']}
            transitionDuration={2000}
            ssr={true}
            autoPlay={true}
          >
            <div className="h-40 md:h-64 lg:h-96 lg:w-96">
              <Principal />
            </div>
            <div className="h-40 md:h-64 lg:h-96 lg:w-96">
              <EnvioGratis />
            </div>
          </Carousel>
        </Suspense>
      </div>
      <div className="md:hidden">
        <Suspense
          fallback={
            <div className="flex h-36 w-full animate-pulse bg-gray-200 md:h-64 lg:h-96"></div>
          }
        >
          <Carousel
            showDots={false}
            responsive={responsive}
            infinite={true}
            removeArrowOnDeviceType={['desktop', 'tablet', 'mobile']}
            transitionDuration={2000}
            autoPlay={true}
          >
            <div className="h-40 md:h-64 lg:h-96 lg:w-96">
              <PrincipalMobil />
            </div>
            <div className="h-40 md:h-64 lg:h-96 lg:w-96">
              <EnvioGratisMobil />
            </div>
          </Carousel>
        </Suspense>
      </div>
    </>
  );
}
