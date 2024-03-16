'use client';
import CarouselComponent from 'components/carousel/page';
import Image from 'next/image';
import { useState } from 'react';

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  const [src, setSrc] = useState(images[0]?.src);

  return (
    <>
      <div className="block py-10 md:hidden">
        <CarouselComponent
          images={images.map((image) => image.src)}
          className="h-72 rounded-b-md"
          autoPlay={false}
          removeArrowOnDeviceType={['desktop', 'tablet']}
        />
      </div>
      <div className="hidden md:grid md:grid-rows-4 lg:grid-cols-4 lg:grid-rows-1">
        <div className="flex-row justify-end lg:flex">
          <div>
            {images.map((image: { src: string; altText: string }) => (
              <Image
                className="rounded-b-lg object-cover pb-3 pr-8"
                key={image.src}
                src={image.src}
                alt=""
                width={120}
                height={120}
                onClick={() => setSrc(image.src)}
              />
            ))}
          </div>
        </div>
        <div className="relative pr-10 md:row-span-3 md:h-[410px] md:w-[410px] lg:col-span-3 lg:h-[500px] lg:w-[500px]">
          <Image className="rounded-b-lg" src={src || ''} alt="" fill />
        </div>
        <div className="mt-3 hidden flex-row gap-x-3 pr-[45px] md:flex lg:hidden">
          {images.map((image: { src: string; altText: string }) => (
            <div key={image.src}>
              <Image
                className="rounded-b-lg rounded-t-lg object-cover"
                src={image.src}
                alt=""
                width={80}
                height={80}
                onClick={() => setSrc(image.src)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
