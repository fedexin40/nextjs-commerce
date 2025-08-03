import Cart from 'components/cart';
import Menu from 'components/layout/navigation';
import User from 'components/user';
import Image from 'next/image';
import Link from 'next/link';
import Search from '../search';

export default function MobileNavbar() {
  return (
    <>
      <nav className="bg-[#f7e7da] text-[13px] tracking-widest lg:text-[14.3px]">
        <div className="flex flex-col pb-3">
          <div className="grid grid-cols-2 uppercase">
            <div className="flex items-center justify-center">
              <Link href="/">
                <div className="relative h-[120px] w-[120px]">
                  <Image
                    className="object-contain"
                    src={'/logoNegroMovil.png'}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Link>
            </div>
            <div className="flex flex-row items-center justify-center gap-4 text-[14px]">
              <div className="text-black underline-offset-4 hover:text-neutral-500 hover:underline">
                <User />
              </div>
              <div>
                <Cart />
              </div>
              <div>
                <Menu />
              </div>
            </div>
          </div>
          <div>
            <div className="w-full px-4">
              <Search />
            </div>
          </div>
        </div>
      </nav>
      <div className="fixed bottom-0 z-50 w-full">
        <div className="grid grid-cols-4 bg-[#f7e7da]">
          <div className="w-full border-x-2 border-white p-2">
            <div className="flex justify-center">
              <User />
            </div>
          </div>
          <div className="w-full border-l-2 border-white p-2">
            <div className="flex justify-center hover:cursor-pointer">
              <Cart />
            </div>
          </div>
          <div className="w-full border-r-2 border-white p-2">
            <div className="flex justify-center">
              <Link href={'https://www.facebook.com/profile.php?id=61571068417335'}>
                <div className="relative h-[27px] w-[27px]">
                  <Image
                    className="object-cover"
                    src="/facebookRosa.png"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Link>
            </div>
          </div>
          <div className="w-full border-x-2 border-white  p-2">
            <div className="flex justify-center">
              <Link href={'https://www.instagram.com/proyecto705/'}>
                <div className="relative h-[27px] w-[27px]">
                  <Image
                    className="object-cover"
                    src="/instagramRosa.png"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
