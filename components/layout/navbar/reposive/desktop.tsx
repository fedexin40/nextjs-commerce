import Cart from 'components/cart';
import OpenCart from 'components/cart/open-cart';
import Menu from 'components/layout/navigation';
import Login from 'components/login';
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
              <div className="text-black underline-offset-4 hover:text-neutral-500 hover:underline dark:text-neutral-400 dark:hover:text-neutral-300">
                Nosotros
              </div>
              <div className="relative">
                <Menu />
              </div>
            </div>
          </div>
          <div>
            <Link
              href="/"
              aria-label="Go back home"
              className="mr-2 flex w-auto items-center justify-center lg:mr-6"
            >
              <div>
                <Image src={'/logoNegro.png'} alt="" width="150" height="150" />
              </div>
            </Link>
          </div>
          <div className="md:col-span-2">
            <div className="flex flex-row items-center space-x-3">
              <div>
                <Search />
              </div>
              <div className="hover:cursor-pointer">
                <Suspense>
                  <Login />
                </Suspense>
              </div>
              <div className="hover:cursor-pointer">
                <Suspense fallback={<OpenCart />}>
                  <Cart />
                </Suspense>
              </div>
              <div className="flex w-2/4 justify-end space-x-3 pr-10">
                <Link href="">
                  <Image src={'/facebookRosa.png'} alt="" width="25" height="25" />
                </Link>
                <Link href="">
                  <Image src={'/instagramRosa.png'} alt="" width="25" height="25" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
