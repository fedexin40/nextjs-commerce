import { GoogleAnalytics } from '@next/third-parties/google';
import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import LoadMore from 'components/load-more/page';
import { getCollectionProducts } from 'lib/saleor';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const googleAnalytics = process.env.googleAnalytics;

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

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
      <div className="relative h-96 w-full overflow-hidden">
        <Image
          src="/banner3.avif"
          alt="Banner Proyecto 705"
          fill
          preload={true}
          loading="eager"
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="relative z-10 grid h-full w-full grid-cols-2 grid-rows-3 gap-5 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-4">
          <div className="col-start-1 row-start-3 mx-5 my-10 flex place-content-center items-center rounded bg-[#f7e7da] py-8 text-[15px] shadow-md md:col-span-1 md:col-start-1 md:row-start-2 md:mx-10 md:my-14 md:text-[18px]">
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
