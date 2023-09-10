import { Suspense } from 'react';
import Banner from '../components/banner';
import NewProducts from '../components/new';
import TrendingList from '../components/trending';

export const runtime = 'edge';

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Saleor.',
  openGraph: {
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(process.env.SITE_NAME || '')}`,
        width: 1200,
        height: 630
      }
    ],
    type: 'website'
  }
};

export default async function HomePage() {
  return (
    <>
      <Suspense>
        <Suspense>
          <Banner />
        </Suspense>
        <Suspense>
          <Suspense>
            <div className="mt-5">
              {/* @ts-expect-error Server Component */}
              <NewProducts />
            </div>
          </Suspense>
          <Suspense>
            <div className="mt-10">
              {/* @ts-expect-error Server Component */}
              <TrendingList />
            </div>
          </Suspense>
        </Suspense>
      </Suspense>
    </>
  );
}
