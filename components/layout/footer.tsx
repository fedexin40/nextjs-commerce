import Link from 'next/link';

import LogoIcon from 'components/icons/logo';
import { getMenu } from 'lib/saleor';
import { Menu } from 'lib/types';
import { AiFillFacebook, AiFillGithub, AiFillInstagram, AiOutlineTwitter } from 'react-icons/ai';

const { SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const menu = await getMenu('next-js-frontend-footer-menu');

  return (
    <footer className="bg-white text-black dark:bg-black dark:text-white">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 border-b border-gray-700 py-12 transition-colors duration-150 lg:grid-cols-12">
          <div className="col-span-1 lg:col-span-3">
            <a className="flex flex-initial items-center font-bold md:mr-24" href="/">
              <span className="mr-2">
                <LogoIcon className="h-8" />
              </span>
              <span>{SITE_NAME}</span>
            </a>
          </div>
          {menu.length ? (
            <nav className="col-span-1 lg:col-span-7">
              <ul className="grid md:grid-flow-col md:grid-cols-3 md:grid-rows-4">
                {menu.map((item: Menu) => (
                  <li key={item.title} className="py-3 md:py-0 md:pb-4">
                    <Link
                      href={item.path}
                      className="text-gray-800 transition duration-150 ease-in-out hover:text-gray-300 dark:text-gray-100"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          <div className="grid grid-cols-4 grid-rows-1 gap-10">
            <div className="transition hover:scale-110">
              <Link aria-label="Github Repository" href="_blank">
                <AiFillGithub className="text-3xl text-gray-800" />
              </Link>
            </div>
            <div className="transition hover:scale-110">
              <Link aria-label="Facebook page" href="_blank">
                <AiFillFacebook className="text-3xl text-gray-800" />
              </Link>
            </div>
            <div className="transition hover:scale-110">
              <Link aria-label="Twitter page" href="_blank">
                <AiOutlineTwitter className="text-3xl text-gray-800" />
              </Link>
            </div>
            <div className="transition hover:scale-110">
              <Link aria-label="Instagram page" href="_blank">
                <AiFillInstagram className="text-3xl text-gray-800" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
