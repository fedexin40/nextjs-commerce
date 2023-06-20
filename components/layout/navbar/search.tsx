'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CiSearch } from 'react-icons/ci';

import SearchIcon from 'components/icons/search';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;

    if (search.value) {
      router.push(`/search?q=${search.value}`);
    } else {
      router.push(`/search`);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center rounded-full bg-black/[0.075] px-3 text-sm transition"
    >
      <input
        type="text"
        name="search"
        placeholder="Search for products..."
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
        className="w-full bg-transparent px-3 py-2 focus:outline-none"
      />
      <CiSearch />
    </form>
  );
}
