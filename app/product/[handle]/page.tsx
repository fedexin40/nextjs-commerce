import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { GridTileImage } from 'components/grid/tile';
import Footer from 'components/layout/footer';
import { Gallery } from 'components/product/gallery';
import { ProductDescription } from 'components/product/product-description';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getCollectionProducts, getProduct } from 'lib/saleor';
import { Image, Product } from 'lib/types';
import Link from 'next/link';
import { Suspense } from 'react';

export const runtime = 'edge';

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function Product({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  return (
    <>
      <div className="mx-auto max-w-screen-2xl">
        <div className="flex flex-col px-10 md:grid md:grid-cols-3 md:px-16 md:pt-12 lg:px-36 lg:pt-16">
          <div className="md:col-span-2">
            <Gallery
              images={product.images.map((image: Image) => ({
                src: image.url,
                altText: image.altText,
              }))}
            />
          </div>
          <div>
            <ProductDescription product={product} />
          </div>
        </div>
        <Suspense>
          <RelatedProducts product={product} />
        </Suspense>
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}

async function RelatedProducts({ product }: { product: Product }) {
  const relatedProducts = await getCollectionProducts({ collection: product.category.slug || '' });

  if (!relatedProducts.length) return null;

  return (
    <div className="py-10 md:py-20 lg:py-20">
      <h4 className="mb-4 text-2xl font-bold">
        <div className="bg-[#f1f1f1]">
          <div className="flex flex-row gap-x-2 p-5 px-10 tracking-wider md:px-16 lg:px-40">
            <div className="border-b-2 border-[#c9aa9e]">Productos</div>
            <div>relacionas</div>
          </div>
        </div>
      </h4>
      <div className="px-10 md:px-16 lg:px-36">
        <ul className="flex w-full gap-4 overflow-x-auto overflow-y-hidden pt-1">
          {relatedProducts.map((product) => (
            <li
              key={product.handle}
              className="aspect-square w-1/2 flex-none sm:w-1/3 md:w-1/4 lg:w-1/4"
            >
              <Link className="relative h-full w-full" href={`/product/${product.handle}`}>
                <GridTileImage
                  alt={product.title}
                  label={{
                    title: product.title,
                    amount: product.priceRange.minVariantPrice.amount,
                    currencyCode: product.priceRange.minVariantPrice.currencyCode,
                  }}
                  src={product.featuredImage?.url}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
