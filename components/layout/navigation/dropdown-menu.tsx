'use client';

import MenuIcon from '@mui/icons-material/Menu';
import { Category, Collection } from 'lib/types';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export function MenuItemCategoryDropdown({ item }: { item: Category }) {
  return (
    <div className="mx-6	mr-14 mt-2 flex w-full whitespace-nowrap text-sm text-black underline-offset-4 hover:underline">
      <Link href={item.url}>{item.name}</Link>
    </div>
  );
}

export function MenuItemCollectionDropdown({ item }: { item: Collection }) {
  return (
    <div className="mx-6	mr-14 mt-2 flex w-full whitespace-nowrap text-sm text-black underline-offset-4 hover:underline">
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
        className="hove:cursor-pointer relative underline-offset-4 hover:underline"
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
          className="absolute right-[110px] top-8 z-50 w-fit rounded-b-md bg-white pb-4 shadow-md md:left-[110px] lg:left-[120px]"
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
        className="hove:cursor-pointer relative underline-offset-4 hover:underline"
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
          className="absolute right-[110px] top-8 z-50 w-fit rounded-b-md bg-white pb-4 shadow-md md:left-[110px] lg:left-[120px]"
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
        className="flex flex-row items-center gap-1 text-black underline-offset-4 hover:text-neutral-500 hover:underline md:gap-2"
      >
        <div className="flex scale-125">
          <MenuIcon />
        </div>
        <div className="hidden md:flex">Aretes</div>
      </div>
      {openSelect && (
        <div className="absolute right-2 top-10 z-50 w-fit rounded-b-md bg-white pb-4 shadow-md md:top-8 lg:right-4 lg:top-8">
          <div className="flex flex-col place-content-center gap-y-5 p-3 capitalize text-black">
            <CategoryItems categories={categories} />
            <CollectionItems collections={collections} />
          </div>
        </div>
      )}
    </div>
  );
}
