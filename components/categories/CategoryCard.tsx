import { Category } from 'lib/types';
import Link from 'next/link';
import Image from 'next/image';

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href="_blank"
      className="relative h-44 max-w-xs overflow-hidden bg-cover bg-no-repeat shadow-2xl"
    >
      <Image
        src={category.backgroundImage?.url || '/bannerImg.png'}
        alt={category.backgroundImage?.altText || ''}
        width={500}
        height={500}
        className="h-full w-full rounded-xl object-cover transition-all delay-75 ease-out hover:scale-125"
      />
      <div className="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col items-center justify-center rounded-xl bg-black/[0.3] transition-all delay-75">
        <h1 className="xs:text-4xl break-all p-3 text-2xl font-extrabold capitalize text-[--theme-color] shadow-sm sm:text-4xl lg:text-4xl">
          {category.name}
        </h1>
      </div>
      <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-white bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-40"></div>
    </Link>
  );
}
