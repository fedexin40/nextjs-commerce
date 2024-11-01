import FooterMenu from 'components/layout/footer-menu';
import { getPagesByMenu } from 'lib/saleor';
import Image from 'next/image';
import Link from 'next/link';

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = currentYear;
  const pages = await getPagesByMenu('next-js-frontend-footer-menu');
  const copyrightName = COMPANY_NAME || SITE_NAME || '';

  return (
    <footer className="bg-[#f1f1f1] text-[13px] tracking-widest text-black dark:bg-zinc-800 dark:text-white lg:text-[14.3px]">
      <div className="flex w-full flex-col gap-6 px-6 py-12 md:gap-12 md:px-10">
        <div className="flex flex-col gap-y-10 md:flex-row lg:px-9">
          <div className="hidden md:block md:basis-1/4 lg:basis-1/3">
            <div className="relative hidden h-28 w-28 dark:block lg:h-36 lg:w-36">
              <Link href={'/'}>
                <Image className="object-contain" src={'/logoBlanco.png'} alt="" fill />
              </Link>
            </div>
            <div className="relative block h-28 w-28 dark:hidden lg:h-36 lg:w-36">
              <Link href={'/'}>
                <Image className="object-contain" src={'/logoNegro.png'} alt="" fill />
              </Link>
            </div>
          </div>
          <div className="md:basis-2/4 lg:basis-1/3">
            <div className="flex flex-col">
              <FooterMenu pages={pages} />
            </div>
          </div>
          <div className="pb-5 md:basis-1/4 md:pb-0 lg:basis-1/3">
            <Contacto />
          </div>
        </div>
        <div className="border-t-2 border-t-gray-500 py-6 dark:border-t-[#c9aa9e] dark:text-[#c9aa9e]">
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
      <div className="flex flex-col gap-y-6 md:text-right">
        <div className="flex flex-row gap-x-6 md:justify-end">
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
        <div className="flex flex-col gap-y-3">
          <div>Tel: 2211664477</div>
          <div>contacto@proyecto705.com</div>
        </div>
      </div>
    </>
  );
}
