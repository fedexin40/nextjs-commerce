'use client';

import MenuIcon from '@mui/icons-material/Menu';
import { Category } from 'lib/types';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export function MenuItemDropdown({ item }: { item: Category }) {
  return (
    <div className="mx-6	mr-14 mt-2 flex w-full whitespace-nowrap text-sm text-black underline-offset-4 hover:underline dark:text-white dark:hover:text-neutral-100">
      <Link href={item.url}>{item.name}</Link>
    </div>
  );
}

export default function MenuDropdown({ categories }: { categories: Category[] }) {
  const [openSelect, setOpenSelect] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => {
          setOpenSelect(!openSelect);
        }}
        className="flex flex-row items-center gap-1 text-black underline-offset-4 hover:text-neutral-500 hover:underline dark:text-black dark:hover:text-neutral-300 md:gap-2"
      >
        <MenuIcon />
        <div className="hidden md:flex">Aretes</div>
      </div>
      {openSelect && (
        <div
          onClick={() => {
            setOpenSelect(false);
          }}
          className="absolute right-0 top-10 z-50 w-fit rounded-b-md bg-white pb-4 shadow-md dark:bg-black md:-right-28 md:top-8 lg:right-4 lg:top-8"
        >
          <div className="grid grid-rows-4 place-content-center capitalize text-black md:gap-x-3">
            {categories.map((category: Category, key: number) => (
              <MenuItemDropdown item={category} key={key} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
