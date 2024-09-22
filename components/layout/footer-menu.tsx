'use client';

import clsx from 'clsx';
import { Menu } from 'lib/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const FooterMenuItem = ({ item }: { item: Menu }) => {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === item.path);

  useEffect(() => {
    setActive(pathname === item.path);
  }, [pathname, item.path]);

  return (
    <div className="flex flex-col gap-5">
      <div className="text-justify">
        {item.path ? (
          <Link
            href={item.path}
            className={clsx(
              'block p-2 text-lg underline-offset-4 hover:text-black hover:underline dark:hover:text-neutral-300 md:inline-block md:text-sm',
              {
                'text-black dark:text-neutral-300': active,
              },
            )}
          >
            {item.title}
          </Link>
        ) : null}
        {item.data ? (
          <div>
            <div className="mb-2 uppercase dark:text-[#c9aa9e]">{item.title}</div>
            <span>{item.data[0]}</span>
          </div>
        ) : null}
      </div>
      <div className="place-content-end text-right">
        <Link className="dark:text-[#c9aa9e]" href={'/'}>
          ... Ver mas
        </Link>
      </div>
    </div>
  );
};

export default function FooterMenu({ menu }: { menu: Menu[] }) {
  if (!menu.length) return null;

  return (
    <>
      {menu.map((item: Menu) => {
        return <FooterMenuItem key={item.title} item={item} />;
      })}
    </>
  );
}
