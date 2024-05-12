'use client';

import { ExternalProvider } from '@fedexin40/auth-sdk';
import { useSaleorExternalAuth } from '@fedexin40/auth-sdk/react';
import clsx from 'clsx';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useTransition } from 'react';

export default function Facebook({
  SALEOR_INSTANCE_URL,
  redirectURL,
}: {
  redirectURL: string;
  SALEOR_INSTANCE_URL: string;
}) {
  const [isPending, startTransition] = useTransition();
  const { authURL } = useSaleorExternalAuth({
    saleorURL: SALEOR_INSTANCE_URL,
    provider: ExternalProvider.OpenIDConnectFacebook,
    redirectURL: redirectURL,
  });

  function Login() {
    startTransition(() => {
      redirect(authURL || '');
    });
  }

  return (
    <div onClick={Login}>
      <div className="mb-3 flex h-10 flex-row gap-5 border-2 border-[#1877F2] bg-[#1877F2] px-5 py-2 text-sm hover:cursor-pointer hover:opacity-60 hover:ease-in">
        <div className="relative h-5 w-5">
          <Image className="object-cover" src={'/facebookLogin.png'} alt="" fill />
        </div>
        <div
          className={clsx('content-center whitespace-nowrap text-white', {
            hidden: isPending,
          })}
        >
          Inciar sesion con Facebook
        </div>
        <div
          className={clsx(
            'flex w-[180px] cursor-not-allowed items-center justify-center space-x-3 self-end p-1 tracking-wider',
            {
              hidden: !isPending,
            },
          )}
        >
          <div className="h-[10px] w-[10px] animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
          <div className="h-[10px] w-[10px] animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
          <div className="h-[10px] w-[10px] animate-bounce rounded-full bg-white"></div>
        </div>
      </div>
    </div>
  );
}
