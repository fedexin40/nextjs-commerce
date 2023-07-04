import Link from 'next/link';
import Image from 'next/image';

import { MdOutlineExplore } from 'react-icons/md';
import { BsBookmarkHeart } from 'react-icons/bs';
import { RxHamburgerMenu } from 'react-icons/rx';

import Cart from 'components/cart';
import LogoIcon from 'components/icons/logo';
import { getMenu } from 'lib/saleor';
import Search from './search';

export default async function Navbar() {
  const menu = await getMenu('next-js-frontend-header-menu');

  return (
    <nav className="max-w-screen fixed left-0 right-0 z-40 mb-3 flex flex-col bg-[--theme-color] px-[4%] py-3 transition delay-75 ease-in-out sm:flex-row md:px-[10%]">
      <div className="flex w-full items-center justify-between">
        <section className="relative flex items-center">
          <Link href="/" aria-label="Go back home">
            <Image
              className="me-3 cursor-pointer  rounded-full border-2 bg-yellow-300 hover:bg-yellow-500"
              src="/defaultUser.png"
              alt="userProfileImage"
              width="40"
              height="40"
            />
          </Link>
          <LogoIcon className="h-8 transition-transform hover:scale-110" />
        </section>
        <div className="relative  hidden sm:block sm:w-1/3">
          <Search />
        </div>

        <section className="flex items-center">
          <Link
            href="/products"
            className="mx-2 rounded-md bg-yellow-700 px-3 py-1 text-sm text-white shadow-sm transition hover:bg-yellow-800"
          >
            <span className="hidden md:block">Explorar</span>{' '}
            <MdOutlineExplore className="md:hidden" />
          </Link>

          <ul className=" hidden justify-between ps-1 text-2xl md:flex">
            <li className="mx-2  cursor-pointer rounded-full bg-gray-200 p-2 shadow-sm transition hover:bg-yellow-800 hover:text-white">
              <BsBookmarkHeart />
            </li>
            <li>
              {/* @ts-expect-error Server Component */}
              <Cart />
            </li>
          </ul>
          <section className="relative cursor-pointer md:hidden">
            <RxHamburgerMenu className="text-lg" />
          </section>
        </section>
      </div>
      <section className="relative mt-4 sm:hidden">
        <Search />
      </section>
    </nav>
  );
}
