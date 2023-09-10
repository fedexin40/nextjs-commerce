'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CiSearch } from 'react-icons/ci';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;

    if (search.value) {
      router.push(`/search?q=${search.value}`);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-md">
      <form onSubmit={onSubmit} className="relative flex items-center bg-white px-3 text-base">
        <input
          type="text"
          name="search"
          placeholder="¿Que estas buscando?"
          autoComplete="off"
          defaultValue={searchParams?.get('q') || ''}
          className="w-full bg-transparent px-3 py-2 focus:outline-none"
        />
        <button className="absolute right-0 rounded-r-md bg-amber-900 p-5">
          <CiSearch className="scale-125 font-extrabold" />
        </button>
      </form>
    </div>
  );
}
