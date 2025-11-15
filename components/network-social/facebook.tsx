'use client';

import { ExternalProvider } from '@fedexin40/auth-sdk';
import { useSaleorExternalAuth } from '@fedexin40/auth-sdk/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Facebook({
  SALEOR_INSTANCE_URL,
  redirectURL,
}: {
  redirectURL: string;
  SALEOR_INSTANCE_URL: string;
}) {
  const { authURL } = useSaleorExternalAuth({
    saleorURL: SALEOR_INSTANCE_URL,
    provider: ExternalProvider.OpenIDConnectFacebook,
    redirectURL: redirectURL,
  });

  return (
    <Link href={authURL || ''}>
      <div
        className="
          mb-3 flex h-10 flex-row gap-5 border-2
          border-[#1877F2] bg-[#1877F2]
          px-5 py-2 text-[13.5px] tracking-[1.4px] hover:cursor-pointer
          hover:opacity-60 hover:ease-in lg:text-[14.3px]"
      >
        <div className="relative h-5 w-5 overflow-hidden rounded-full">
          <Image
            className="scale-[1.8] object-contain"
            src={'/facebookLogin.png'}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        <div className="hidden content-center whitespace-nowrap text-white md:block">
          Inciar sesion con Facebook
        </div>
        <div className="block  content-center whitespace-nowrap text-white md:hidden">
          Inciar con Facebook
        </div>
      </div>
    </Link>
  );
}
