'use client';
import { ExternalProvider } from '@fedexin40/auth-sdk';
import { useSaleorExternalAuth } from '@fedexin40/auth-sdk/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Facebook({
  SALEOR_INSTANCE_URL,
  SHOP_PUBLIC_URL,
}: {
  SHOP_PUBLIC_URL: string;
  SALEOR_INSTANCE_URL: string;
}) {
  const redirectURL = new URL('api/auth/callback/facebook', SHOP_PUBLIC_URL).toString();
  const { authURL } = useSaleorExternalAuth({
    saleorURL: SALEOR_INSTANCE_URL,
    provider: ExternalProvider.OpenIDConnectFacebook,
    redirectURL: redirectURL,
  });

  return (
    <Link href={authURL || ''}>
      <div className="mb-3 flex h-10 flex-row gap-5 border-2 border-[#1877F2] bg-[#1877F2] px-5 py-2 text-sm hover:cursor-pointer hover:opacity-60 hover:ease-in">
        <div className="relative h-5 w-5">
          <Image className="object-cover" src={'/facebookLogin.png'} alt="" fill />
        </div>
        <div className="content-center whitespace-nowrap text-white">
          Inciar sesion con Facebook
        </div>
      </div>
    </Link>
  );
}
