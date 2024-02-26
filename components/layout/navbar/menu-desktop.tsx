import Cart from 'components/cart';
import OpenCart from 'components/cart/open-cart';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import Search from './search';

export default function DesktopMenu() {
  return (
    <>
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
    </>
  );
}
