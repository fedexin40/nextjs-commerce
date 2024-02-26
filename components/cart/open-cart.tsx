import Image from 'next/image';

export default function OpenCart({ quantity }: { quantity?: number }) {
  return (
    <div>
      <Image src={'/carrito.png'} alt="" width="20" height="20" />
      {quantity ? (
        <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-blue-600 text-[11px] font-medium text-white">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
