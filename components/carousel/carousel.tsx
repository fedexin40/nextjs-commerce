import Image from 'next/image';

export function CarouselImage({ image }: { image: string }) {
  return (
    <div className="static">
      <div className="relative h-52 w-full md:h-64 lg:h-96">
        <Image
          priority={true}
          className="object-cover"
          src={image}
          alt=""
          fill={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  );
}
