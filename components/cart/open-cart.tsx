import Image from 'next/image';

export default function OpenCart({ quantity }: { quantity?: number }) {
  return (
    <div className="relative">
      <Image src={'/carrito.png'} alt="" width="20" height="20" />
      {quantity ? (
        <div className="absolute -right-4 -top-3 flex h-5 w-5 place-content-center rounded-full bg-[hsl(28,30%,59%)] pt-0.5 text-[11px] font-medium text-white shadow-xl shadow-black md:-right-6 md:top-5 lg:-right-3 lg:-top-3">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
