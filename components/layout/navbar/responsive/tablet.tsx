import Cart from 'components/cart';
import Menu from 'components/layout/navigation';
import User from 'components/user';
import Image from 'next/image';
import Link from 'next/link';
import Search from '../search';

export default function TabletNavbar() {
  return (
    <>
      <nav className="bg-[#f7e7da] pb-3 text-[13px] tracking-widest lg:text-[14.3px]">
        <div className="grid grid-cols-5 content-center items-center pb-3 uppercase">
          <div className="col-span-2 h-full self-end">
            <div className="flex h-full flex-row place-items-center items-center justify-end gap-x-10">
              <div className="text-black underline-offset-4 hover:text-neutral-500 hover:underline">
                <Link href="/sobre-nosotros">Nosotros</Link>
              </div>
              <div className="relative">
                <Menu />
              </div>
            </div>
          </div>
          <div className="m-x-10 flex w-auto items-center justify-center">
            <div className="relative">
              <Link href="/" aria-label="Go back home">
                <div className="relative h-[140px] w-[140px]">
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
          </div>
          <div className="col-span-2 h-full place-items-center self-end">
            <div className="-mb-2 flex h-full flex-row place-items-center justify-center">
              <div>
                <Search />
              </div>
              <div className="flex w-2/4 justify-end gap-6 pr-10">
                <Link href={'https://www.facebook.com/profile.php?id=61571068417335'}>
                  <div className="relative h-[25px] w-[25px]">
                    <Image
                      className="object-contain"
                      src={'/facebookRosa.png'}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </Link>
                <Link href={'https://www.instagram.com/proyecto705/'}>
                  <div className="relative h-[25px] w-[25px]">
                    <Image
                      className="object-contain"
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
          <div className="fixed bottom-10 right-20 z-50 rounded-md">
            <div className="grid grid-rows-1 rounded-md bg-[#f7e7da]">
              <div className="border-b-2 border-white p-4">
                <div className="flex justify-center">
                  <User />
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-center">
                  <Cart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
