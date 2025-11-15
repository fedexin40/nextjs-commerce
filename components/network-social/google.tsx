'use client';

import { ExternalProvider } from '@saleor/auth-sdk';
import { useSaleorExternalAuth } from '@saleor/auth-sdk/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Google({
  SALEOR_INSTANCE_URL,
  redirectURL,
}: {
  SALEOR_INSTANCE_URL: string;
  redirectURL: string;
}) {
  const { authURL } = useSaleorExternalAuth({
    saleorURL: SALEOR_INSTANCE_URL,
    provider: ExternalProvider.OpenIDConnect,
    redirectURL: redirectURL,
  });

  return (
    <Link href={authURL || ''}>
      <div
        className="
          flex h-10 flex-row gap-5 border-2 border-[#a8a8a8] px-5 py-2
          text-[13.5px] tracking-[1.4px] hover:cursor-pointer
          hover:opacity-60 hover:ease-in lg:text-[14.3px]"
      >
        <div className="relative h-5 w-5">
          <Image
            className="object-cover"
            src={'/googleLogin.png'}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        <div className="hidden whitespace-nowrap md:block">Inciar sesion con Google</div>
        <div className="block whitespace-nowrap md:hidden">Inciar con Google</div>
      </div>
    </Link>
  );
}
