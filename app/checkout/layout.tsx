import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbarBlack/page';
import Loading from 'components/loading';
import { Suspense } from 'react';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        <Suspense
          fallback={
            <>
              <div className="flex h-[300px] place-items-center justify-center text-center lg:h-[400px]">
                <Loading />
              </div>
            </>
          }
        >
          <Navbar />
          {children}
          <div className="min-h-10 h-10 w-full bg-zinc-400 dark:bg-[#c9aa9e]" />
          <Footer />
        </Suspense>
      </div>
    </>
  );
}
