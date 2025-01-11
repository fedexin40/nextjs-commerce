import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';
import Loading from 'components/loading';
import Link from 'next/link';
import { Suspense } from 'react';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <>
      <div>
        <Suspense
          fallback={
            <>
              <div className="flex h-screen flex-col items-center justify-center">
                <div className="relative bottom-10 right-6">
                  <Loading />
                </div>
              </div>
            </>
          }
        >
          <Navbar />
          <div className="text-[13px] tracking-widest lg:text-[14.3px]">
            <div className="mx-10 mb-16 mt-10 flex flex-col justify-center text-center md:mx-20 md:mb-24 md:mt-16 lg:mx-32 lg:mb-40 lg:mt-20">
              <div className="bg-black p-10 text-white">
                <div>Lo siento mucho pero la pagina que estas buscando no la pudimos encontrar</div>
                <div className="pt-8 uppercase text-[#d2b6ab]">
                  <Link href={'/'}>Regresar al Inicio</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="min-h-10 h-10 w-full bg-zinc-400 dark:bg-[#c9aa9e]" />
          <div className="text-[13px] tracking-widest lg:text-[14.3px]">
            <Footer />
          </div>
        </Suspense>
      </div>
    </>
  );
}
