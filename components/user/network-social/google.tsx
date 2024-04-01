'use client';
import { ExternalProvider } from '@fedexin40/auth-sdk';
import { useSaleorExternalAuth } from '@fedexin40/auth-sdk/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Google() {
  const saleorURL = 'https://api.proyecto705.com/graphql/';

  const { authURL } = useSaleorExternalAuth({
    saleorURL: saleorURL,
    provider: ExternalProvider.OpenIDConnectGoogle,
    redirectURL: 'https://shop.proyecto705.com/api/login/external/google',
  });

  return (
    <Link href={authURL || ''}>
      <div className="flex h-10 flex-row gap-5 border-2 border-[#a8a8a8] px-5 py-2 text-sm hover:cursor-pointer hover:opacity-60 hover:ease-in">
        <div className="relative h-5 w-5">
          <Image className="object-cover" src={'/googleLogin.png'} alt="" fill />
        </div>
        <div className="content-center whitespace-nowrap text-[#a8a8a8]">
          Inciar sesion con Google
        </div>
      </div>
    </Link>
  );
}
