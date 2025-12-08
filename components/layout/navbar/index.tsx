import Cart from 'components/cart';
import Menu from 'components/layout/navigation';
import SearchModal from 'components/search';
import MarqueeText from 'components/text-scroll/page';
import User from 'components/user';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="">
      <div className="text-[13px] tracking-widest lg:text-[14.3px]">
        <MarqueeText>
          <div className="flex flex-row font-medium italic md:font-semibold">
            <div className="mr-28">Envíos a toda la república, y gratis a partir de $1500 MXN</div>
            <div className="mr-28">3 y 6 Meses sin intereses</div>
            <div className="mr-28">Envíos desde $85 MXN</div>
            <div className="mr-28">Aretes de 10 y 14 kilates</div>
          </div>
        </MarqueeText>
      </div>
      <nav className="h-[56px] bg-[#f7e7da]/90 text-[13px] tracking-widest md:py-2 lg:text-[14.3px]">
        <div className="grid grid-cols-5 items-center uppercase">
          <div className="col-span-2 pl-5 md:col-span-1">
            <Link href="/" aria-label="Go home">
              <div className="relative h-[50px] md:top-1 md:h-[35px]">
                <Image
                  className="object-contain"
                  src={'/logoNegroMovil2.png'}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </Link>
          </div>
          <div className="col-span-2 hidden md:block md:pl-10">
            <div className="justify-right flex w-full flex-row gap-x-10">
              <div className="text-black underline-offset-4 hover:text-neutral-500 hover:underline">
                <Link href="/sobre-nosotros">Nosotros</Link>
              </div>
              <div>
                <Menu />
              </div>
            </div>
          </div>
          <div className="col-span-3 justify-items-end pr-5 md:col-span-2 md:pr-16">
            <div className="flex flex-row justify-end gap-x-2 md:gap-x-5">
              <div className="hover:cursor-pointer">
                <User />
              </div>
              <div className="hover:cursor-pointer">
                <Cart />
              </div>
              <div className="hover:cursor-pointer">
                <SearchModal />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
