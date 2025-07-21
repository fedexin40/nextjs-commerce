import CarouselComponent from 'components/carousel/page';
import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import LoadMore from 'components/load-more/page';
import { getCollectionProducts } from 'lib/saleor';
import type { Metadata } from 'next';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Proyecto 705 Joyeria, aretes y broqueles de oro.',
  description:
    'Compra aretes y broqueles de oro de 10 kilates y 14 kilates, ademas tambien tenemos oro amarillo, oro blanco y oro rosa',
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
    <>
      <div className="hidden md:block">
        <CarouselComponent
          images={['/EnvioGratisMayores1500.jpeg', '/banner.png']}
          autoPlay={true}
          removeArrowOnDeviceType={['desktop', 'tablet', 'mobile']}
        />
      </div>
      <div className="block md:hidden">
        <CarouselComponent
          images={['/EnvioGratisMayores1500Mobile.jpeg', '/bannerMobile.png']}
          autoPlay={true}
          removeArrowOnDeviceType={['desktop', 'tablet', 'mobile']}
        />
      </div>
      <div className="my-10 grid justify-items-center whitespace-nowrap text-base font-medium tracking-[2px] text-black lg:my-14 lg:tracking-[5px] xl:text-3xl">
        <h1>Encuentra el arete perfecto para ti</h1>
      </div>
      <div className="mx-10 mb-24 lg:mx-32 lg:mb-40">
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
    </>
  );
}
