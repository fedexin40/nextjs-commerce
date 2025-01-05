import CarouselComponent from 'components/carousel/page';
import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import LoadMore from 'components/load-more/page';
import { getCollectionProducts } from 'lib/saleor';
import { Suspense } from 'react';

export const runtime = 'edge';

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
    <>
      <div className="hidden md:block">
        <Suspense>
          <CarouselComponent
            images={['/EnvioGratisMayores1500.jpeg', '/banner.png']}
            autoPlay={true}
            removeArrowOnDeviceType={['desktop', 'tablet', 'mobile']}
          />
        </Suspense>
      </div>
      <div className="block md:hidden">
        <Suspense>
          <CarouselComponent
            images={['/EnvioGratisMayores1500Mobile.jpeg', '/bannerMobile.png']}
            autoPlay={true}
            removeArrowOnDeviceType={['desktop', 'tablet', 'mobile']}
          />
        </Suspense>
      </div>
      <div className="m-10 grid justify-items-center whitespace-nowrap text-base font-medium tracking-wider text-black dark:text-[#c9aa9e] xl:text-3xl">
        Encuentra el arete perfecto para ti
      </div>
      <Suspense>
        <div className="mx-10 mb-24 lg:mx-32 lg:mb-40">
          {products.length > 0 && (
            <Grid className="grid-cols-1 gap-y-24 md:grid-cols-3 lg:grid-cols-4 xl:gap-y-40">
              <ProductGridItems products={products} />
            </Grid>
          )}
        </div>
      </Suspense>
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
    </>
  );
}
