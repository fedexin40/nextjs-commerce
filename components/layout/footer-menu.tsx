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
          <div className="mb-2 uppercase">{item.title}</div>
          <span>{item.data}</span>
        </div>
      ) : null}
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
