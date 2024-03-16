'use client';
import Image from 'next/image';
import { useState } from 'react';

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  const [src, setSrc] = useState(images[0]?.src);

  return (
    <>
      <div className="py-10 md:hidden">
        <div className="">
          <ul className="flex w-full gap-4 overflow-x-auto overflow-y-hidden pt-1">
            {images.map((image) => (
              <li key={image.src} className="aspect-square w-[250px] flex-none">
                <Image
                  className="relative h-full w-full object-cover"
                  src={image.src}
                  alt={image.altText}
                  height={100}
                  width={100}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="hidden md:grid md:grid-rows-4 lg:grid-cols-4 lg:grid-rows-1">
        <div className="hidden gap-y-3 lg:flex lg:flex-col">
          {images.map((image: { src: string; altText: string }) => (
            <div key={image.src}>
              <Image
                className="object-cover"
                src={image.src}
                alt=""
                width={120}
                height={120}
                onClick={() => setSrc(image.src)}
              />
            </div>
          ))}
        </div>
        <div className="relative pr-10 md:row-span-3 md:h-[410px] md:w-[410px] lg:col-span-3 lg:h-[500px] lg:w-[500px]">
          <Image className="rounded-b-lg object-cover" src={src || ''} alt="" fill />
        </div>
        <div className="mt-3 hidden flex-row gap-x-3 pr-[45px] md:flex lg:hidden">
          {images.map((image: { src: string; altText: string }) => (
            <div key={image.src}>
              <Image
                className="object-cover"
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
