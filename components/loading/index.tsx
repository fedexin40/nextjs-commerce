import Image from 'next/image';

export default function Loading() {
  return (
    <div className="relative">
      <div
        className="text-surface absolute inline-block h-14 w-14 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
      <div className="absolute">
        <div className="relative left-1 top-1 hidden h-[47px] w-[47px] dark:block">
          <Image
            className="object-contain"
            src={'/logoBlanco.png'}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="relative left-1 top-1 block h-[47px] w-[47px] dark:hidden">
          <Image
            className="object-contain"
            src={'/logoNegro.png'}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
    </div>
  );
}
