import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';
import { Suspense } from 'react';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      {children}
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
