'use client';
import { PageItem } from 'components/htmlParser/page';
import MyImage from 'components/image';
import Loading from 'components/loading';
import Image from 'next/image';
import { Suspense, useState } from 'react';

export function Gallery({
  images,
  description,
}: {
  images: { src: string; altText: string }[];
  description: string;
}) {
  const [src, setSrc] = useState(0);

  return (
    <>
      <div className="py-10 md:hidden">
        <div>
          <ul className="flex w-full gap-4 overflow-x-auto overflow-y-hidden pt-1">
            {images.map((image) => (
              <li key={image.src} className="aspect-square w-[250px] flex-none">
                <div className="relative h-64 w-64">
                  <MyImage src={image.src} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="hidden md:grid md:h-[550px] md:grid-rows-4 lg:grid-cols-4 lg:grid-rows-1">
        <div className="hidden gap-y-3 pr-10 lg:flex lg:flex-col">
          {images.map((image: { src: string; altText: string }, index) => (
            <div className="relative lg:h-24 lg:w-24" key={image.src}>
              <Suspense
                fallback={
                  <div className="flex h-10 place-items-center justify-center text-center">
                    <Loading />
                  </div>
                }
              >
                <Image
                  className="object-contain"
                  src={image.src}
                  alt={image.altText}
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
          <Suspense
            fallback={
              <div className="flex h-10 place-items-center justify-center text-center">
                <Loading />
              </div>
            }
          >
            <Image
              priority={true}
              className="rounded-b-lg object-cover"
              src={images[src]?.src as string}
              alt={images[src]?.altText || ''}
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
                alt={image.altText}
                fill
                onClick={() => setSrc(index)}
                priority={true}
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="hidden pr-10 md:-mt-5 md:block lg:mt-5">
        {description && <PageItem content={JSON.parse(description)} />}
      </div>
    </>
  );
}
