'use client';

import MenuIcon from '@mui/icons-material/Menu';
import { Category, Collection } from 'lib/types';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export function MenuItemCategoryDropdown({ item }: { item: Category }) {
  return (
    <div className="mx-6	mr-14 mt-2 flex w-full whitespace-nowrap text-sm text-black underline-offset-4 hover:underline dark:text-white dark:hover:text-neutral-100">
      <Link href={item.url}>{item.name}</Link>
    </div>
  );
}

export function MenuItemCollectionDropdown({ item }: { item: Collection }) {
  return (
    <div className="mx-6	mr-14 mt-2 flex w-full whitespace-nowrap text-sm text-black underline-offset-4 hover:underline dark:text-white dark:hover:text-neutral-100">
      <Link href={item.path}>{item.title}</Link>
    </div>
  );
}

function CollectionItems({ collections }: { collections: Collection[] }) {
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
    <>
      <div
        className="hove:cursor-pointer relative underline-offset-4 hover:underline dark:text-white dark:hover:text-neutral-100"
        onClick={() => {
          setOpenSelect(!openSelect);
        }}
        ref={ref}
      >
        Collecciones
      </div>
      {openSelect && (
        <div
          onClick={() => {
            setOpenSelect(false);
          }}
          className="absolute right-32 top-8 z-50 w-fit rounded-b-md bg-white pb-4 shadow-md dark:bg-black md:-right-28 md:left-32 lg:right-4"
        >
          <div className="flex flex-col place-content-center gap-y-3 capitalize text-black">
            {collections.map((collection: Collection, key: number) => (
              <MenuItemCollectionDropdown item={collection} key={key} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function CategoryItems({ categories }: { categories: Category[] }) {
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
    <>
      <div
        className="hove:cursor-pointer relative underline-offset-4 hover:underline dark:text-white dark:hover:text-neutral-100"
        onClick={() => {
          setOpenSelect(!openSelect);
        }}
        ref={ref}
      >
        Categorias
      </div>
      {openSelect && (
        <div
          onClick={() => {
            setOpenSelect(false);
          }}
          className="absolute right-32 top-8 z-50 w-fit rounded-b-md bg-white pb-4 shadow-md dark:bg-black md:-right-28 md:left-32 md:top-8"
        >
          <div className="flex flex-col place-content-center gap-y-3 capitalize text-black">
            {categories.map((category: Category, key: number) => (
              <MenuItemCategoryDropdown item={category} key={key} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function MenuDropdown({
  categories,
  collections,
}: {
  categories: Category[];
  collections: Collection[];
}) {
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
        <div className="absolute right-2 top-10 z-50 w-fit rounded-b-md bg-white pb-4 shadow-md dark:bg-black md:top-8 lg:right-4 lg:top-8">
          <div className="flex flex-col place-content-center gap-y-5 p-3 capitalize text-black dark:text-white">
            <CategoryItems categories={categories} />
            <CollectionItems collections={collections} />
          </div>
        </div>
      )}
    </div>
  );
}
