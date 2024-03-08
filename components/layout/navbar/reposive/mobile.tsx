import Cart from 'components/cart';
import OpenCart from 'components/cart/open-cart';
import Login from 'components/login';
import { Menu } from 'lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export default function MobileNavbar({ menu }: { menu: Menu[] }) {
  return (
    <>
      <nav className="bg-[#f7e7da]">
        <div className="grid grid-cols-2 content-center items-center pb-3 uppercase">
          <div>
            <Link
              href="/"
              aria-label="Go back home"
              className="mr-2 flex w-full md:w-auto md:items-center md:justify-center lg:mr-6"
            >
              <div className="ml-5 mt-4 block justify-self-start">
                <Image src={'/logoNegroMovil.png'} alt="" width="100" height="100" />
              </div>
            </Link>
          </div>
          <div className="md:col-span-2">
            <div className="flex w-full flex-row justify-center pt-12 text-xs">
              {menu.length ? (
                <ul className="flex gap-3 text-sm">
                  {menu.map((item: Menu) => (
                    <li key={item.title}>
                      <Link
                        href={item.path}
                        className="text-black underline-offset-4 hover:text-neutral-500 hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
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
                <Login />
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
