import Brevo from 'components/brevo/page';
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
      <div className="flex w-full flex-col gap-6 px-6 py-6 md:gap-12 md:px-10 lg:py-12">
        <div className="flex flex-col gap-y-10 md:flex-row lg:px-9">
          <div className="hidden md:block md:basis-1/4 lg:basis-1/3">
            <div className="relative hidden h-28 w-28 dark:block lg:h-36 lg:w-36">
              <Link href={'/'}>
                <div className="relative h-28 w-28 lg:h-36 lg:w-36">
                  <Image
                    className="object-contain"
                    src={'/logoBlanco.png'}
                    alt=""
                    fill
                    priority={true}
                  />
                </div>
              </Link>
            </div>
            <div className="relative block h-28 w-28 dark:hidden lg:h-36 lg:w-36">
              <Link href={'/'}>
                <div className="relative h-28 w-28 lg:h-36 lg:w-36">
                  <Image
                    className="object-contain"
                    src={'/logoNegro.png'}
                    alt=""
                    fill
                    priority={true}
                  />
                </div>
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
        <div className="border-t-2 border-t-gray-500 pt-6 dark:border-t-[#c9aa9e] dark:text-[#c9aa9e]">
          <div className="flex w-full flex-row justify-start md:pl-10">
            <p>
              &copy; {copyrightDate} {copyrightName}
              {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </div>
      <Brevo />
    </footer>
  );
}

export function Contacto() {
  return (
    <>
      <div className="flex flex-col gap-y-6 md:text-right">
        <div className="flex flex-row gap-x-6 md:justify-end">
          <div>
            <div className="relative h-7 w-7 hover:cursor-pointer">
              <Link href={'https://www.facebook.com/profile.php?id=61571068417335'}>
                <Image
                  className="object-contain"
                  src={'/facebook.png'}
                  alt="Siguenos en Facebook"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </Link>
            </div>
          </div>
          <div>
            <div className="relative h-7 w-7 hover:cursor-pointer">
              <Link href={'https://www.instagram.com/proyecto705/'}>
                <Image
                  src={'/instagram.png'}
                  alt="Siguenos en Instagram"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-3">
          <a href="https://api.whatsapp.com/send?phone=522225215239">Whatsapp: 222 521 52 39</a>
          <div>
            <a href="mailto:contacto@proyecto705.com.mx">contacto@proyecto705.com.mx</a>
          </div>
        </div>
      </div>
    </>
  );
}
