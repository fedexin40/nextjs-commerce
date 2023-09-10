import Image from 'next/image';
import Link from 'next/link';
import { BsBookmarkHeart } from 'react-icons/bs';
import Cart from './cart';
import Login from './login';
import Search from './search';

export default async function Navbar() {
  return (
    <nav className="max-w-screen fixed left-0 right-0 z-40 mb-3 flex flex-col bg-gradient-to-tr from-gray-100 to-gray-300 px-[4%] py-3 drop-shadow-2xl transition delay-75 ease-in-out sm:flex-row md:px-[10%]">
      <div className="flex w-full items-center justify-between">
        <section className="relative flex items-center">
          <Login />
          <Link href="/" aria-label="Go back home">
            <Image
              className="cursor-pointer hover:scale-110"
              src="/picture.png"
              alt="userProfileImage"
              width="40"
              height="40"
            />
          </Link>
        </section>
        <div className="relative  hidden w-6/12 sm:block">
          <Search />
        </div>
        <section className="flex items-center">
          <div className="flex flex-row text-2xl">
            <div className="mx-2  cursor-pointer rounded-full bg-gray-200 p-2 shadow-sm transition hover:bg-yellow-800 hover:text-white">
              <BsBookmarkHeart />
            </div>
            <div>
              <Cart />
            </div>
          </div>
        </section>
      </div>
      <section className="relative mt-4 sm:hidden">
        <Search />
      </section>
    </nav>
  );
}
