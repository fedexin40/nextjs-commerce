'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-2xl font-bold leading-10 tracking-tight text-neutral-800">
          Algo salio mal
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600">
          Nuestro equipo de desarrollo ya ha sido informado y esta trabajando en la solución
        </p>
        <button
          className="mt-8 h-10 rounded-md bg-red-500 px-6 font-semibold text-white"
          onClick={() => router.replace('/')}
        >
          Volver a la página de inicio
        </button>
      </div>
    </div>
  );
}
