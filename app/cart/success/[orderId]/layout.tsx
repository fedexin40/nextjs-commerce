import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';
import { Suspense } from 'react';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      <div>{children}</div>
      <Suspense>
        <div className="min-h-10 h-10 w-full bg-zinc-400 dark:bg-[#c9aa9e]" />
        <Footer />
      </Suspense>
    </>
  );
}
