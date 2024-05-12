import Cart from 'components/cart';
import OpenCart from 'components/cart/open-cart';
import Menu from 'components/layout/navigation';
import User from 'components/user';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export default function MobileNavbar() {
  return (
    <>
      <nav className="bg-[#f7e7da]">
        <div className="grid grid-cols-2 content-center items-center pb-3 uppercase">
          <div className="mt-4">
            <Link href="/" aria-label="Go back home">
              <div className="relative left-10 top-2">
                <Image src={'/logoNegroMovil.png'} alt="" width="100" height="100" />
              </div>
            </Link>
          </div>
          <div className="col-span-1 self-end">
            <div className="flex flex-row gap-x-5">
              <div className="text-black underline-offset-4 hover:text-neutral-500 hover:underline dark:text-black dark:hover:text-neutral-300">
                Nosotros
              </div>
              <div className="relative">
                <Menu />
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="fixed bottom-0 z-50 w-full">
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
              <Suspense>
                <User />
              </Suspense>
            </div>
          </div>
          <div className="w-full border-l-2 border-white p-2">
            <div className="flex justify-center hover:cursor-pointer">
              <Suspense fallback={<OpenCart />}>
                <Cart />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
