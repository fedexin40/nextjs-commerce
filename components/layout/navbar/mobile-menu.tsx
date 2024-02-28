import Image from 'next/image';

export default function MobileMenu() {
  return (
    <div className="">
      <div className="grid grid-cols-4 bg-[#f7e7da]">
        <div className="w-full border-r-2 border-white p-2">
          <div className="flex justify-center">
            <Image src="/facebookRosa.png" alt="" width="25" height="25" />
          </div>
        </div>
        <div className="w-full border-x-2 border-white  p-2">
          <div className="flex justify-center">
            <Image src="/instagramRosa.png" alt="" width="25" height="25" />
          </div>
        </div>
        <div className="w-full border-x-2 border-white p-2">
          <div className="flex justify-center">
            <Image src="/registro.png" alt="" width="25" height="25" />
          </div>
        </div>
        <div className="w-full border-l-2 border-white p-2">
          <div className="flex justify-center">
            <Image src="/carrito.png" alt="" width="20" height="20" />
          </div>
        </div>
      </div>
    </div>
  );
}
