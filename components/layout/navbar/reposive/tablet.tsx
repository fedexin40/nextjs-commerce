import Cart from 'components/cart';
import OpenCart from 'components/cart/open-cart';
import Menu from 'components/layout/navigation';
import User from 'components/user';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import Search from '../search';

export default function TabletNavbar() {
  return (
    <>
      <nav className="bg-[#f7e7da] pb-3">
        <div className="grid grid-cols-5 content-center items-center pb-3 uppercase">
          <div className="col-span-2 self-end">
            <div className="flex flex-row justify-end gap-x-10">
              <div className="text-black underline-offset-4 hover:text-neutral-500 hover:underline dark:text-neutral-400 dark:hover:text-neutral-300">
                Nosotros
              </div>
              <div className="relative">
                <Menu />
              </div>
            </div>
          </div>
          <div className="m-x-10 flex w-auto items-center justify-center">
            <div className="relative top-5">
              <Link href="/" aria-label="Go back home">
                <Image src={'/logoNegro.png'} alt="" width="140" height="140" />
              </Link>
            </div>
          </div>
          <div className="col-span-2 self-end">
            <div className="-mb-2 flex flex-row items-center justify-around">
              <div>
                <Suspense>
                  <Search />
                </Suspense>
              </div>
              <div className="flex w-2/4 justify-end gap-6 pr-10">
                <Link href="">
                  <Image src={'/facebookRosa.png'} alt="" width="25" height="25" />
                </Link>
                <Link href="">
                  <Image src={'/instagramRosa.png'} alt="" width="25" height="25" />
                </Link>
              </div>
            </div>
          </div>
          <div className="fixed bottom-10 right-20 z-50 rounded-md">
            <div className="grid grid-rows-1 rounded-md bg-[#f7e7da]">
              <div className="border-b-2 border-white p-4">
                <div className="flex justify-center">
                  <Suspense>
                    <User />
                  </Suspense>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-center">
                  <Suspense fallback={<OpenCart />}>
                    <Cart />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
