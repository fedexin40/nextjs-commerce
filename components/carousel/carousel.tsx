import Image from 'next/image';

export function CarouselImage({ image }: { image: string }) {
  return <Image priority={true} className="object-cover" src={image} alt="" fill={true} />;
}
