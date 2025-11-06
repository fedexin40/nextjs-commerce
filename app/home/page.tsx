import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import LoadMore from 'components/load-more/page';
import MarqueeText from 'components/text-scroll/page';
import Whatsapp from 'components/whatsapp/page';
import { getCollectionProducts } from 'lib/saleor';
import Link from 'next/link';

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
    <div className="block">
      <Whatsapp />
      <div className="relative h-96 w-full bg-[url(/banner4.png)] bg-cover bg-center bg-no-repeat">
        <div className="grid h-full w-full grid-cols-2 grid-rows-3 gap-5 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-4">
          <div
            className="
              col-start-1 row-start-3 mx-5 my-10 flex
              place-content-center items-center rounded bg-[#f7e7da] py-8 text-[15px] shadow-md md:col-span-1
              md:col-start-1 md:row-start-2 md:mx-10 md:my-14 md:text-[18px]"
          >
            <Link href={'/search'}>Ver catálogo</Link>
          </div>
        </div>
      </div>
      <div className="my-10 grid justify-items-center whitespace-nowrap text-base font-medium tracking-[2px] text-black lg:my-14 lg:tracking-[5px] xl:text-3xl">
        <MarqueeText direction="right" speed={60}>
          <div className="flex flex-row font-medium italic md:font-semibold">
            <div className="mr-28">Encuentra el arete perfecto para ti</div>
            <div className="mr-28">Aretes de 10 y 14 kilates</div>
          </div>
        </MarqueeText>
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
    </div>
  );
}
