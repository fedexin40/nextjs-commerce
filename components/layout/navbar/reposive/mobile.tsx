import Cart from 'components/cart';
import OpenCart from 'components/cart/open-cart';
import Menu from 'components/layout/navigation';
import User from 'components/user';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import Search from '../search';

export default function MobileNavbar() {
  return (
    <>
      <nav className="bg-[#f7e7da] text-[13px] tracking-widest lg:text-[14.3px]">
        <div className="grid grid-cols-2 pb-3 uppercase">
          <div className="flex items-center justify-center">
            <Link href="/" aria-label="Go back home">
              <div className="relative h-[120px] w-[120px]">
                <Suspense>
                  <Image
                    className="object-contain"
                    src={'/logoNegroMovil.png'}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </Suspense>
              </div>
            </Link>
          </div>
          <div className="grid grid-rows-2 pr-5 pt-5">
            <div className="flex flex-row items-center justify-around gap-4 text-[14px]">
              <div className="text-black underline-offset-4 hover:text-neutral-500 hover:underline dark:text-black dark:hover:text-neutral-300">
                Nosotros
              </div>
              <div>
                <Menu />
              </div>
            </div>
            <div className="flex h-full items-center">
              <Search />
            </div>
          </div>
        </div>
      </nav>
      <div className="fixed bottom-0 z-50 w-full">
        <div className="grid grid-cols-4 bg-[#f7e7da]">
          <div className="w-full border-r-2 border-white p-2">
            <div className="flex justify-center">
              <div className="relative h-[25px] w-[25px]">
                <Suspense>
                  <Image
                    className="object-cover"
                    src="/facebookRosa.png"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </Suspense>
              </div>
            </div>
          </div>
          <div className="w-full border-x-2 border-white  p-2">
            <div className="flex justify-center">
              <Suspense>
                <div className="relative h-[25px] w-[25px]">
                  <Image
                    className="object-cover"
                    src="/instagramRosa.png"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Suspense>
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
