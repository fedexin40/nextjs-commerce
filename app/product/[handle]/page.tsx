import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import Grid from 'components/grid';
import CarouselProduct from 'components/product/carousel';
import { Gallery } from 'components/product/gallery';
import ScrollToTop from 'components/scrollup';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getCollectionProducts, getProduct } from 'lib/saleor';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const hide = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: hide,
      follow: hide,
      googleBot: {
        index: hide,
        follow: hide
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <ScrollToTop />
      <div className="mb-5 grid rounded-3xl pt-32 sm:pt-20 sm:shadow-2xl">
        <div className="flex w-full">
          <Gallery product={product} />
        </div>
        <Suspense>
          {/* @ts-expect-error Server Component */}
          <RelatedProducts handle={product.categorySlug} />
        </Suspense>
      </div>
    </>
  );
}

async function RelatedProducts({ handle }: { handle: string }) {
  const relatedProducts = await getCollectionProducts(handle);
  if (!relatedProducts.length) return null;

  return (
    <div className="px-4 py-8">
      <div className="mb-4 text-3xl font-bold">Productos Relacionados</div>
      <Grid className="grid">
        <CarouselProduct products={relatedProducts} />
      </Grid>
    </div>
  );
}
