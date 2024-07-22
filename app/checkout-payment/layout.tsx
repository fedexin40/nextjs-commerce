import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbarBlack/page';
import Loading from 'components/loading';
import { Suspense } from 'react';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
        {children}
        <div className="min-h-10 h-10 w-full bg-zinc-400 dark:bg-[#c9aa9e]" />
        <Footer />
      </Suspense>
    </>
  );
}
