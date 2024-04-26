import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      <Suspense>
        <div className="w-full">
          <div className="mx-8 max-w-2xl py-20 sm:mx-auto">
            <Suspense>{children}</Suspense>
          </div>
        </div>
        <Footer />
      </Suspense>
    </>
  );
}
