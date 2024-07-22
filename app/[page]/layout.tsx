import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';
import Loading from 'components/loading';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
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
          <Footer />
        </Suspense>
      </div>
    </>
  );
}
