import Image from 'next/image';

export default function FirstShoppingImage() {
  return (
    <>
      <div className="h-full w-full md:hidden">
        <Image
          src={'/first-shopping.png'}
          width={800} // ajusta a tu imagen real
          height={1200}
          alt="first-shopping"
          className="block max-h-[90vh] max-w-[90vw] object-contain"
        />
      </div>
      <div className="hidden h-full w-full md:block">
        <Image
          src={'/first-shopping-pc.png'}
          width={800} // ajusta a tu imagen real
          height={1200}
          alt="first-shopping"
          className="block max-h-[90vh] max-w-[90vw] object-contain"
        />
      </div>
    </>
  );
}
