import Cart from 'components/cart';
import OpenCart from 'components/cart/open-cart';
import { Menu } from 'lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import Search from '../search';

export default function DesktopNavbar({ menu }: { menu: Menu[] }) {
  return (
    <>
      <nav className="bg-[#f7e7da]">
        <div className="grid grid-cols-5 content-center items-center pb-3 uppercase">
          <div className="col-span-2 block">
            <div className="flex w-full flex-row justify-end">
              {menu.length ? (
                <ul className="flex items-center gap-6 text-sm">
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
              <div>
                <Suspense fallback={<OpenCart />}>
                  <Image src={'/registro.png'} alt="" width="25" height="25" />
                </Suspense>
              </div>
              <div>
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
