import { GoogleAnalytics } from '@next/third-parties/google';
import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import LoadMore from 'components/load-more/page';
import { getCollectionProducts } from 'lib/saleor';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

const googleAnalytics = process.env.googleAnalytics;

export default async function HomePage() {
  const collection = 'oro';
  const first = 24;
  const productsPagination = await getCollectionProducts({
    collection: collection,
    first: first,
  });
  const products = productsPagination.products;
  const totalCount = productsPagination.totalCount;
  const numbersOfPages = Math.ceil(totalCount / first) - 1;

  return (
    <div>
      <GoogleAnalytics gaId={googleAnalytics || ''} />
      <div className="relative aspect-[5/5] w-full overflow-hidden md:aspect-[19/9] lg:aspect-[25/9]">
        <div className="hidden md:block">
          <Image
            src="/descuento_pc.avif"
            alt="Banner Proyecto 705"
            fill
            preload={true}
            loading="eager"
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="block md:hidden">
          <Image
            src="/discount.avif"
            alt="Banner Proyecto 705"
            fill
            preload={true}
            loading="eager"
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 z-10 grid h-full w-full grid-cols-2 grid-rows-3 gap-5 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-4">
          <div className="pointer-events-auto col-start-1 row-start-3 mx-5 my-8 flex items-center justify-center rounded bg-[#f7e7da] py-5 text-[15px] shadow-md md:col-span-1 md:col-start-1 md:row-start-2 md:mx-10 md:my-14 md:py-3 md:text-[18px] lg:h-[68px] lg:py-0">
            <Link href="/search">Ver catálogo</Link>
          </div>
        </div>
      </div>
      <div className="mx-10 mb-24 pt-3 lg:mx-32 lg:mb-40">
        {products.length > 0 && (
          <Grid className="grid-cols-2 gap-y-24 md:grid-cols-3 lg:grid-cols-4 xl:gap-y-40">
            <ProductGridItems products={products} />
          </Grid>
        )}
      </div>
      {productsPagination.hasNextPage && (
        <div className="pt-2 lg:pt-0">
          <LoadMore
            numbersOfPages={numbersOfPages}
            endCursor={productsPagination.endCursor}
            startCursor={productsPagination.startCursor}
            first={first}
            collection={collection}
          />
        </div>
      )}
    </div>
  );
}
