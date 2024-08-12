import FooterMenu from 'components/layout/footer-menu';
import { getMenu } from 'lib/saleor';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = currentYear;
  const menu = await getMenu('next-js-frontend-footer-menu');
  const copyrightName = COMPANY_NAME || SITE_NAME || '';

  return (
    <footer className="bg-[#f1f1f1] text-[13px] tracking-widest text-black dark:bg-zinc-800 dark:text-white lg:text-[14.3px]">
      <div className="flex w-full flex-col gap-6 px-6 py-12 md:gap-12 md:px-4 xl:px-10">
        <div className="grid grid-cols-1 justify-around gap-10 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          <Suspense>
            <FooterMenu menu={menu} />
          </Suspense>

          <div className="flex flex-col gap-y-5 lg:col-start-2 lg:col-end-3">
            <Contacto />
            <div className="hidden md:mt-3 md:block lg:hidden">
              <Pagos />
            </div>
          </div>
          <div className="md:hidden lg:block">
            <Pagos />
          </div>
        </div>
        <div className="border-t-2 border-t-gray-500 py-6 dark:border-t-[#c9aa9e] dark:text-[#c9aa9e] lg:-mt-28">
          <div className="flex w-full flex-row justify-start md:pl-10">
            <p>
              &copy; {copyrightDate} {copyrightName}
              {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Contacto() {
  return (
    <>
      <div className="uppercase dark:text-[#c9aa9e]">Contacto</div>
      <div className="flex flex-row items-center gap-x-3">
        <div className="relative h-5 w-5">
          <Image
            className="object-contain"
            src={'/mail.png'}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <span>contacto@proyecto705.com</span>
      </div>
      <div className="-mt-3 flex flex-row items-center gap-x-3 dark:text-white">
        <div className="relative h-5 w-5 dark:text-white">
          <Image
            src={'/whats.png'}
            alt=""
            fill
            className="fill-current dark:text-white"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <span>22 11 66 44 77</span>
      </div>
    </>
  );
}

export function Pagos() {
  return (
    <>
      <div className="grid grid-cols-3 items-center gap-y-3 md:h-fit">
        <div className="flex flex-row gap-x-5 self-end">
          <Link className="hover:cursor-pointer" href="">
            <div className="relative h-7 w-7">
              <Image className="object-contain" src={'/facebook.png'} alt="" fill />
            </div>
          </Link>
          <Link className="hover:cursor-pointer" href="">
            <div className="relative h-7 w-7">
              <Image
                src={'/instagram.png'}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </Link>
        </div>
        <div className="row-start-2 -mt-3">
          <div className="relative h-7 w-20">
            <Image
              className="object-contain"
              src={'/americanexpress.png'}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
        <div className="row-start-2">
          <div className="relative h-7 w-20">
            <Image
              className="object-contain"
              src={'/visa.png'}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
        <div className="row-start-2">
          <div className="relative h-10 w-16">
            <Image
              className="object-contain"
              src={'/mastercard.png'}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      </div>
    </>
  );
}
