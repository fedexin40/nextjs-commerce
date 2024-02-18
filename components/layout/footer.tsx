import FooterMenu from 'components/layout/footer-menu';
import { getMenu } from 'lib/saleor';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = currentYear;
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700';
  const menu = await getMenu('next-js-frontend-footer-menu');
  const copyrightName = COMPANY_NAME || SITE_NAME || '';

  return (
    <footer className="bg-[#f1f1f1] text-sm text-black">
      <div className="mx-auto w-full gap-6 px-6 py-12 text-sm md:gap-12 md:px-4 xl:px-10">
        <div className="grid grid-cols-1 justify-around gap-10 md:grid-cols-3 md:grid-rows-2">
          <Suspense
            fallback={
              <div className="flex h-[188px] w-[200px] flex-col gap-2">
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
              </div>
            }
          >
            <FooterMenu menu={menu} />
          </Suspense>
          <div className="hidden md:block" />
          <div className="flex flex-col gap-y-5">
            <div className="uppercase">Contacto</div>
            <div className="flex flex-row items-center gap-x-3">
              <div>
                <Image src={'/mail.png'} alt="" width="20" height="10" />
              </div>
              <span>contacto@proyecto705.com</span>
            </div>
            <div className="flex flex-row items-center gap-x-3">
              <div>
                <Image src={'/whats.png'} alt="" width="20" height="10" />
              </div>
              <span>22 11 66 44 77</span>
            </div>
          </div>
          <div className="grid grid-cols-3 items-center justify-items-center gap-y-3 md:h-fit">
            <span className="flex flex-row gap-x-5 self-end">
              <Link className="hover:cursor-pointer" href="">
                <Image src={'/facebook.png'} alt="" width="30" height="30" />
              </Link>
              <Link className="hover:cursor-pointer" href="">
                <Image src={'/instagram.png'} alt="" width="30" height="30" />
              </Link>
            </span>
            <div />
            <div />
            <div>
              <Image src={'/americanexpress.png'} alt="" width="100" height="100" />
            </div>
            <div>
              <Image src={'/visa.png'} alt="" width="64" height="64" />
            </div>
            <div>
              <Image src={'/mastercard.png'} alt="" width="64" height="64" />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-10 border-t-2 border-t-gray-500 py-6 text-sm md:-mt-28">
        <div className="flex w-full flex-row justify-center md:justify-start md:pl-10">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
