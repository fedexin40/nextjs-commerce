import { Suspense } from 'react';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <div className="mx-auto flex max-w-7xl flex-col  py-6 pt-28 text-black md:flex-row md:pt-20">
          <div className="order-last min-h-screen w-full md:order-none">{children}</div>
        </div>
      </Suspense>
    </>
  );
}
