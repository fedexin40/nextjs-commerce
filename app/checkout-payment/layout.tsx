import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbarBlack/page';
import { Suspense } from 'react';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      <div className="mb-24 min-w-full px-6 pt-16 tracking-wider lg:mb-40 lg:px-48">{children}</div>
      <Suspense>
        <div className="min-h-10 h-10 w-full bg-zinc-400 dark:bg-[#c9aa9e]" />
        <Footer />
      </Suspense>
    </>
  );
}
