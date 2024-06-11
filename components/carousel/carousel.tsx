import Image from 'next/image';

export function CarouselImage({ image }: { image: string }) {
  return (
    <div className="static">
      <Image
        priority={true}
        className="object-cover"
        src={image}
        alt=""
        fill={true}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
