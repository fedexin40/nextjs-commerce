'use client';

import { Category } from 'lib/types';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export function MenuItemDropdown({ item }: { item: Category }) {
  return (
    <div className="p-2 text-center text-[9px] font-semibold text-black underline-offset-4 hover:text-neutral-500 hover:underline dark:text-neutral-400 dark:hover:text-neutral-300 md:text-[10px]">
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
        className="text-black underline-offset-4 hover:text-neutral-500 hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
      >
        Aretes
      </div>
      {openSelect && (
        <div
          onClick={() => {
            setOpenSelect(false);
          }}
          className="absolute -right-2 top-8 z-50 w-[23rem] shadow-md shadow-gray-400 md:-right-28 md:top-8 md:w-[26rem] lg:right-4 lg:top-8"
        >
          <div className="grid grid-cols-4 place-content-center bg-white uppercase text-black md:gap-x-3">
            {categories.map((category: Category, key: number) => (
              <MenuItemDropdown item={category} key={key} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
