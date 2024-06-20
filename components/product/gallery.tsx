'use client';
import Loading from 'components/loading';
import Image from 'next/image';
import { Suspense, useState } from 'react';

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  const [src, setSrc] = useState(0);

  return (
    <>
      <div className="py-10 md:hidden">
        <div>
          <ul className="flex w-full gap-4 overflow-x-auto overflow-y-hidden pt-1">
            {images.map((image) => (
              <li key={image.src} className="aspect-square w-[250px] flex-none">
                <Suspense fallback={<Loading />}>
                  <Image
                    className="relative h-full w-full object-cover"
                    src={image.src}
                    alt={image.altText}
                    height={100}
                    width={100}
                    sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                  />
                </Suspense>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="hidden md:grid md:h-[550px] md:grid-rows-4 lg:grid-cols-4 lg:grid-rows-1">
        <div className="hidden gap-y-3 pr-10 lg:flex lg:flex-col">
          {images.map((image: { src: string; altText: string }, index) => (
            <div className="relative lg:h-24 lg:w-24" key={image.src}>
              <Suspense fallback={<Loading />}>
                <Image
                  className="object-contain"
                  src={image.src}
                  alt=""
                  fill
                  onClick={() => setSrc(index)}
                  priority={true}
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                />
              </Suspense>
            </div>
          ))}
        </div>
        <div className="relative mr-10 md:row-span-3 lg:col-span-3">
          <Suspense fallback={<Loading />}>
            <Image
              priority={true}
              className="rounded-b-lg object-cover"
              src={images[src]?.src as string}
              alt=""
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
            />
          </Suspense>
        </div>
        <div className=" mt-3 hidden flex-row gap-x-3 md:flex md:w-[410px] lg:hidden lg:w-[500px]">
          {images.map((image: { src: string; altText: string }, index) => (
            <div className="relative h-20 w-20" key={image.src}>
              <Image
                className="object-contain"
                src={image.src}
                alt=""
                fill
                onClick={() => setSrc(index)}
                priority={true}
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
