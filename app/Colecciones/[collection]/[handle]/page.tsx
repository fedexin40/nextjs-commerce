import { ProductView } from 'components/FacebookPixel';
import { GridTileImage } from 'components/grid/tile';
import { Gallery } from 'components/product/gallery';
import { ProductDescription } from 'components/product/product-description';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getCollectionProducts, getProduct } from 'lib/saleor';
import { Image, Product as productType, ProductVariant } from 'lib/types';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const runtime = 'edge';
const { SHOP_PUBLIC_URL } = process.env;

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  let product;
  try {
    product = await getProduct(params.handle);
  } catch (error) {
    notFound();
  }

  if (!product) return notFound();

  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
  };
}

export default async function Product({
  params,
  searchParams,
}: {
  params: { handle: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let product;
  try {
    product = await getProduct(params.handle);
  } catch (error) {
    notFound();
  }
  const variants = product?.variants;

  const variant = variants?.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams[option.name.toLowerCase()],
    ),
  );

  if (!product) return notFound();

  let url = new URL(
    `Colecciones/${product.featureCollection?.slug}/${product.handle}`,
    SHOP_PUBLIC_URL,
  ).toString();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    productID: product.handle,
    name: product.title,
    description: product.descriptionHtml,
    url: url,
    image: product.featuredImage.url,
    brands: 'Proyecto 705',
    offers: [
      {
        '@type': 'Offer',
        price: product.priceRange.maxVariantPrice.amount,
        priceCurrency: product.priceRange.maxVariantPrice.currencyCode,
        itemCondition: 'https://schema.org/NewCondition',
        availability: 'https://schema.org/InStock',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense>
        <ProductView content_ids={[product.handle]} content_type="product" />
      </Suspense>
      <div className="mx-auto max-w-screen-2xl dark:bg-black">
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
            <ProductDescription product={product} variant={variant} />
          </div>
        </div>
        <Suspense>
          <RelatedProducts product={product} />
        </Suspense>
      </div>
    </>
  );
}

async function RelatedProducts({ product }: { product: productType }) {
  const productsByPage = await getCollectionProducts({ collection: product.category.slug || '' });
  const relatedProducts = productsByPage.products;

  if (!relatedProducts.length) return null;

  return (
    <div className="py-10 md:py-20 lg:py-20">
      <h4 className="mb-4 text-2xl font-bold">
        <div className="bg-[#e6e1e1] dark:bg-zinc-800">
          <div className="flex flex-row gap-x-2 p-5 px-10 tracking-wider md:px-16 lg:px-40">
            <div className="border-b-2 border-[#c9aa9e]">Productos</div>
            <div>relacionados</div>
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
              <Link
                className="relative h-full w-full"
                href={`/Colecciones/${product.featureCollection?.slug}/${product.handle}`}
              >
                <GridTileImage
                  alt={product.title}
                  label={{
                    title: product.title,
                    amountMax: product.priceRange.maxVariantPrice.amount,
                    amountMin: product.priceRange.minVariantPrice.amount,
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
