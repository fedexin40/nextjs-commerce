import Image from 'next/image';
import Link from 'next/link';
import { BsArrowDownRightCircle } from 'react-icons/bs';

export default function Banner() {
  return (
    <main className="relative mb-5 flex items-center justify-between py-1 pt-32  sm:pt-20">
      <section className="mx-auto w-full max-w-xl  py-2 sm:mx-0  lg:w-1/3">
        <h1 className="w-full  py-3 text-6xl font-semibold  sm:text-7xl lg:text-8xl ">
          Glasses & Lens
        </h1>
        <p className="text-md py-3  text-gray-600">
          Buy the best high-quality sunglasses from us.
          <br />
          More than 100 types of assortment.
        </p>
        <section className="flex items-center">
          <Link
            href="/products"
            className="rounded-lg bg-gray-900 px-4  py-2 text-sm text-gray-100 hover:bg-gray-800 disabled:bg-opacity-50 disabled:hover:bg-opacity-50 md:text-base"
          >
            Start Shopping
          </Link>
          <Link href="/products" className="flex items-center p-3">
            <span className="mx-2 text-sm md:text-base">Explore More</span>{' '}
            <BsArrowDownRightCircle className="text-lg" />
          </Link>
        </section>
      </section>
      <section className="hidden w-1/2 justify-end lg:flex">
        <Image
          src="/bannerImg.png"
          alt="bannerImg"
          className="h-full w-2/3"
          width={527}
          height={458}
        />
      </section>
    </main>
  );
}
