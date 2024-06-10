import Cart from 'components/cart';
import OpenCart from 'components/cart/open-cart';
import Menu from 'components/layout/navigation';
import User from 'components/user';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import Search from '../search';

export default function DesktopNavbar() {
  return (
    <>
      <nav className="bg-[#f7e7da]">
        <div className="grid grid-cols-5 content-center items-center pb-3 uppercase">
          <div className="col-span-2 block">
            <div className="flex w-full flex-row justify-end gap-x-10">
              <div className="text-black underline-offset-4 hover:text-neutral-500 hover:underline dark:text-black dark:hover:text-neutral-300">
                Nosotros
              </div>
              <div className="relative">
                <Suspense>
                  <Menu />
                </Suspense>
              </div>
            </div>
          </div>
          <div>
            <Suspense>
              <Link
                href="/"
                aria-label="Go back home"
                className="mr-2 flex w-auto items-center justify-center lg:mr-6"
              >
                <div className="relative h-[100px] w-full">
                  <Image className="object-contain" src={'/logoNegro.png'} alt="" fill />
                </div>
              </Link>
            </Suspense>
          </div>
          <div className="md:col-span-2">
            <div className="flex flex-row items-center space-x-3">
              <div className="w-1/3">
                <Suspense>
                  <Search />
                </Suspense>
              </div>
              <div className="hover:cursor-pointer">
                <Suspense>
                  <User />
                </Suspense>
              </div>
              <div className="hover:cursor-pointer">
                <Suspense fallback={<OpenCart />}>
                  <Cart />
                </Suspense>
              </div>
              <div className="flex w-2/4 justify-end space-x-3 pr-10">
                <Suspense>
                  <Link href="">
                    <div className="relative h-[25px] w-[25px]">
                      <Image className="object-cover" src={'/facebookRosa.png'} alt="" fill />
                    </div>
                  </Link>
                </Suspense>
                <Suspense>
                  <Link href="">
                    <div className="relative h-[25px] w-[25px]">
                      <Image className="object-cover" src={'/instagramRosa.png'} alt="" fill />
                    </div>
                  </Link>
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
