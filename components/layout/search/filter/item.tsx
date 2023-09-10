'use client';

import clsx from 'clsx';
import { SortFilterItem } from 'lib/constants';
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ListItem, PathFilterItem } from '.';

function PathFilterItem({ item }: { item: PathFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(pathname === item.path);

  useEffect(() => {
    setActive(pathname === item.path);
  }, [pathname, item.path]);

  return (
    <li className="mt-2 flex text-sm text-gray-400" key={item.title}>
      <Link
        href={createUrl(item.path, searchParams)}
        className={clsx('w-full hover:text-gray-800 dark:hover:text-gray-100', {
          'text-gray-600 dark:text-gray-400': !active,
          'font-semibold text-black dark:text-white': active
        })}
      >
        {item.title}
      </Link>
    </li>
  );
}

function SortFilterItem({ item }: { item: SortFilterItem }) {
  const pathname = usePathname();

  const href =
    item.slug && item.slug.length
      ? createUrl(pathname, new URLSearchParams({ sort: item.slug }))
      : pathname;

  return (
    <li className="mt-2 flex text-sm text-gray-400" key={item.title}>
      <Link
        prefetch={false}
        href={href}
        className="flex w-full items-center rounded-md px-2 py-2 text-left font-sans text-sm font-medium tracking-wide text-gray-900 hover:bg-violet-500 hover:text-white"
      >
        {item.title}
      </Link>
    </li>
  );
}

export function FilterItem({ item }: { item: ListItem }) {
  return 'path' in item ? <PathFilterItem item={item} /> : <SortFilterItem item={item} />;
}
