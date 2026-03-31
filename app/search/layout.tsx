import { GoogleAnalytics } from '@next/third-parties/google';
import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';
import Loading from 'components/loading';
import { Suspense } from 'react';

const googleAnalytics = process.env.googleAnalytics;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        <GoogleAnalytics gaId={googleAnalytics || ''} />
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
          <div className="text-[13px] tracking-widest lg:text-[14.3px]">{children}</div>
          <div className="text-[13px] tracking-widest lg:text-[14.3px]">
            <Footer />
          </div>
          <Footer />
        </Suspense>
      </div>
    </>
  );
}
