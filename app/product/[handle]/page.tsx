import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getProduct } from 'lib/saleor';
import ProductPage from '../responsive/desktop';

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
      <div>
        <ProductPage product={product} />
      </div>
    </>
  );
}
