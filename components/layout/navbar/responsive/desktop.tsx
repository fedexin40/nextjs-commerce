import Cart from 'components/cart';
import Menu from 'components/layout/navigation';
import User from 'components/user';
import Image from 'next/image';
import Link from 'next/link';
import Search from '../search';

export default function DesktopNavbar() {
  return (
    <>
      <nav className="bg-[#f7e7da] text-[13px] tracking-widest lg:text-[14.3px]">
        <div className="grid grid-cols-5 content-center items-center pb-3 uppercase">
          <div className="col-span-2 block">
            <div className="flex w-full flex-row items-center justify-end gap-x-10">
              <div className="text-black underline-offset-4 hover:text-neutral-500 hover:underline">
                <Link href="/sobre-nosotros">Nosotros</Link>
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
              <div className="relative h-[100px] w-full">
                <Image
                  className="object-contain"
                  src={'/logoNegro.png'}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </Link>
          </div>
          <div className="md:col-span-2">
            <div className="flex flex-row items-center space-x-3">
              <div className="w-1/3">
                <Search />
              </div>
              <div className="hover:cursor-pointer">
                <User />
              </div>
              <div className="hover:cursor-pointer">
                <Cart />
              </div>
              <div className="flex w-2/4 justify-end space-x-3 pr-10">
                <Link href={'https://www.facebook.com/profile.php?id=61571068417335'}>
                  <div className="relative h-[27px] w-[27px]">
                    <Image
                      className="object-cover"
                      src={'/facebookRosa.png'}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </Link>
                <Link href={'https://www.instagram.com/proyecto705/'}>
                  <div className="relative h-[27px] w-[27px]">
                    <Image
                      className="object-cover"
                      src={'/instagramRosa.png'}
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
      </nav>
    </>
  );
}
