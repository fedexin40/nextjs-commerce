import { FacebookConversionApi, ProductView } from 'components/FacebookPixel';
import { GridTileImage } from 'components/grid/tile';
import { PageItem } from 'components/htmlParser/page';
import { Gallery } from 'components/product/gallery';
import { ProductDescription } from 'components/product/product-description';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getCollectionProducts, getProduct, Me } from 'lib/saleor';
import { Image, Product as productType, ProductVariant } from 'lib/types';
import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const runtime = 'edge';
const { SHOP_PUBLIC_URL } = process.env;
const date = new Date().getTime();
const current_timestamp = Math.floor(date / 1000);

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  let product;
  try {
    product = await getProduct(params.handle);
  } catch (error) {
    notFound();
  }

  if (!product) return notFound();

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
  };
}

export default async function Product(props: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const user = await Me();

  const headersList = await headers();
  const cookieStore = await cookies();
  const xForwardedFor = headersList.get('x-forwarded-for');
  const remoteAddress = headersList.get('remoteAddress');
  const userAgent = headersList.get('user-agent');
  const pathname = headersList.get('x-current-path');
  const fbp = cookieStore.get('_fbp')?.value;
  const fbclid = searchParams['fbclid'];
  let updateCookie = false;
  let fbc = cookieStore.get('_fbc')?.value;

  if (!fbc && fbclid) {
    fbc = `fb.2.${current_timestamp}.${fbclid}`;
    updateCookie = true;
  }

  let product;
  try {
    product = await getProduct(params.handle);
  } catch (error) {
    notFound();
  }
  if (!product) {
    return notFound();
  }

  const eventId = `${product.handle}_ViewContent_${current_timestamp}`;
  let ip;
  if (xForwardedFor && xForwardedFor.split(',')[0]) {
    // If x-forwarded-for is present, take the first IP address
    ip = xForwardedFor.split(',')[0]?.trim();
  } else if (remoteAddress) {
    // If x-forwarded-for is not present, use remoteAddress
    ip = remoteAddress;
  } else {
    ip = 'unknown'; // Handle cases where no IP is available
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
      <FacebookConversionApi
        ip={ip}
        userAgent={userAgent}
        fbc={fbc}
        fbp={fbp}
        eventName="ViewContent"
        eventId={eventId}
        email={user.email || null}
        phone={user.address.phone || null}
        productID={product.handle}
        value={product.priceRange.maxVariantPrice.amount}
        eventURL={`${SHOP_PUBLIC_URL}/${pathname}`}
        updateCookie={updateCookie}
        SHOP_PUBLIC_URL={SHOP_PUBLIC_URL || ''}
      />
      <ProductView
        content_ids={[product.handle]}
        event_id={eventId}
        value={product.priceRange.maxVariantPrice.amount}
      />
      <div className="mx-auto max-w-screen-2xl">
        <div className="flex flex-col px-10 md:px-16 md:pt-12 lg:px-36 lg:pt-16">
          <div className="flex flex-col md:grid md:grid-cols-3">
            <div className="md:col-span-2">
              <Gallery
                images={product.images.map((image: Image) => ({
                  src: image.url,
                  altText: image.altText,
                }))}
                description={product.description}
              />
            </div>
            <div>
              <ProductDescription product={product} variant={variant} />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="md:hidden">
              {product.description && <PageItem content={JSON.parse(product.description)} />}
            </div>
          </div>
        </div>
        <RelatedProducts product={product} />
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
        <div className="bg-[#e6e1e1]">
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
