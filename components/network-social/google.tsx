'use client';

import { ExternalProvider } from '@fedexin40/auth-sdk';
import { useSaleorExternalAuth } from '@fedexin40/auth-sdk/react';
import clsx from 'clsx';
import Image from 'next/image';
import { permanentRedirect } from 'next/navigation';
import { useTransition } from 'react';

export default function Google({
  SALEOR_INSTANCE_URL,
  redirectURL,
}: {
  SALEOR_INSTANCE_URL: string;
  redirectURL: string;
}) {
  const [isPending, startTransition] = useTransition();
  const { authURL } = useSaleorExternalAuth({
    saleorURL: SALEOR_INSTANCE_URL,
    provider: ExternalProvider.OpenIDConnectGoogle,
    redirectURL: redirectURL,
  });

  function Login() {
    startTransition(() => {
      permanentRedirect(authURL || '');
    });
  }

  return (
    <div onClick={Login}>
      <div className=" flex h-10 flex-row gap-5 border-2 border-[#a8a8a8] px-5 py-2 text-[13.5px] tracking-[1.4px] hover:cursor-pointer hover:opacity-60 hover:ease-in lg:text-[14.3px]">
        <div className="relative h-5 w-5">
          <Image
            className="object-cover"
            src={'/googleLogin.png'}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        <div
          className={clsx('content-center whitespace-nowrap', {
            hidden: isPending,
          })}
        >
          Inciar sesion con Google
        </div>
        <div
          className={clsx(
            'flex w-[180px] cursor-not-allowed items-center justify-center space-x-3 self-end p-1',
            {
              hidden: !isPending,
            },
          )}
        >
          <div className="h-[10px] w-[10px] animate-bounce rounded-full bg-[#a8a8a8] [animation-delay:-0.3s]"></div>
          <div className="h-[10px] w-[10px] animate-bounce rounded-full bg-[#a8a8a8] [animation-delay:-0.15s]"></div>
          <div className="h-[10px] w-[10px] animate-bounce rounded-full bg-[#a8a8a8]"></div>
        </div>
      </div>
    </div>
  );
}
