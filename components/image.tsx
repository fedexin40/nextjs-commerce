import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

function Loading() {
  return (
    <div
      className="text-surface absolute inline-block h-10 w-10 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-black"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
}

export default function MyImage({ src }: { src: string | StaticImport }) {
  return (
    <div className="h-full w-full">
      <div className="absolute z-10 flex h-full w-full items-center justify-center">
        <Loading />
      </div>
      <div className="relative h-full w-full">
        <Image
          className="absolute z-20 object-cover"
          src={src}
          alt=""
          fill
          sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
    </div>
  );
}
