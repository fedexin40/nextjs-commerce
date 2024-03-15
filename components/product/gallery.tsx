'use client';
import Image from 'next/image';
import { useState } from 'react';

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  const [src, setSrc] = useState(images[0]?.src);

  return (
    <div className="grid md:grid-rows-4 lg:grid-cols-4 lg:grid-rows-1">
      <div className="hidden flex-row justify-end lg:flex">
        <div>
          {images.map((image: { src: string; altText: string }) => (
            <Image
              className="rounded-b-lg pb-3 pr-8"
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
              className="rounded-b-lg rounded-t-lg"
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
  );
}
