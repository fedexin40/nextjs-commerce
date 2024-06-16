import { Me, countryArea } from 'lib/saleor';
import Image from 'next/image';
import { Suspense } from 'react';
import Address from './address';

export default async function UserDetails() {
  const states = await countryArea();
  const me = await Me();
  return (
    <div className="flex flex-col px-5">
      <div className="flex flex-row place-content-center pt-5">
        <div className="relative h-16 w-16">
          <Suspense>
            <Image
              className="object-cover"
              src={'/session_blanco.png'}
              alt=""
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Suspense>
        </div>
      </div>
      <div className="pt-3 text-center text-sm tracking-wider dark:text-[#c9aa9e]">Mi Cuenta</div>
      <div className="pt-5">
        <Address user={me} countryAreaChoices={states} />
      </div>
    </div>
  );
}
