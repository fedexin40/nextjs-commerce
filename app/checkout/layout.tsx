import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbarBlack/page';
import { Suspense } from 'react';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      <div className="">{children}</div>
      <Suspense>
        <div className="min-h-10 h-10 w-full bg-zinc-400" />
        <Footer />
      </Suspense>
    </>
  );
}
