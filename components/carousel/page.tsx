'use client';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { CarouselImage } from './carousel';

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

export default function CarouselComponent({
  images,
  className,
  autoPlay,
  removeArrowOnDeviceType,
  infinite,
}: {
  images: string[];
  className: string;
  autoPlay: boolean;
  infinite?: boolean;
  removeArrowOnDeviceType?: string[];
}) {
  return (
    <>
      <div>
        <Carousel
          showDots={false}
          responsive={responsive}
          infinite={infinite || true}
          removeArrowOnDeviceType={removeArrowOnDeviceType}
          transitionDuration={2000}
          ssr={true}
          autoPlay={autoPlay}
        >
          {images.map((image) => {
            return (
              <div className={className} key={image}>
                <CarouselImage image={image} />
              </div>
            );
          })}
        </Carousel>
      </div>
    </>
  );
}
