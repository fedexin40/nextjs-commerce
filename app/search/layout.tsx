import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';
import { Suspense } from 'react';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Suspense>
        <div className="flex flex-col gap-8 px-4 pb-4 text-black dark:text-white md:flex-row">
          <div className="order-last w-full md:order-none">{children}</div>
        </div>
      </Suspense>
      <Footer />
    </>
  );
}
