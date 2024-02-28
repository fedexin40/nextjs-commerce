import { getMenu } from 'lib/saleor';
import { Menu } from 'lib/types';
import Image from 'next/image';
import Link from 'next/link';
import DesktopMenu from './menu-desktop';
import MobileMenu from './mobile-menu';

export default async function Navbar() {
  const menu = await getMenu('next-js-frontend-header-menu');

  return (
    <>
      <nav className="bg-[#f7e7da]">
        <div className="grid grid-cols-2 content-center items-center pb-3 uppercase md:grid-cols-5">
          <div className="hidden md:col-span-2 md:block">
            <div className="flex w-full flex-row justify-end">
              {menu.length ? (
                <ul className="gap-6 text-sm md:flex md:items-center">
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
              className="mr-2 flex w-full md:w-auto md:items-center md:justify-center lg:mr-6"
            >
              <div className="hidden md:block">
                <Image src={'/logoNegro.png'} alt="" width="150" height="150" />
              </div>
              <div className="ml-5 mt-3 block justify-self-start md:hidden">
                <Image src={'/logoNegroMovil.png'} alt="" width="100" height="100" />
              </div>
            </Link>
          </div>
          <div className="md:col-span-2">
            <div className="hidden md:block">
              <DesktopMenu />
            </div>
            <div className="flex w-full flex-row justify-center pt-12 text-xs md:hidden">
              {menu.length ? (
                <ul className="flex gap-3 text-sm md:items-center">
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
      <div className="fixed bottom-0 z-50 block w-full md:hidden">
        <MobileMenu />
      </div>
    </>
  );
}
