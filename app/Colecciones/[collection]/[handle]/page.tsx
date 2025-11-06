import { FacebookConversionApi, ProductView } from 'components/FacebookPixel';
import { GridTileImage } from 'components/grid/tile';
import { PageItem } from 'components/htmlParser/page';
import { Gallery } from 'components/product/gallery';
import { ProductDescription } from 'components/product/product-description';
import Whatsapp from 'components/whatsapp/page';
import { getCollectionProducts, getProduct, Me } from 'lib/saleor';
import { Image, Product as productType, ProductVariant } from 'lib/types';
import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const baseUrl = process.env.SHOP_PUBLIC_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

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

  const canonical = new URL(
    `Colecciones/${product.featureCollection?.slug}/${product.handle}`,
    baseUrl,
  ).toString();
  const title = `${product.title} - Proyecto 705`;
  const desc = product.description;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description: desc,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: 'Proyecto 705',
      title,
      description: desc,
      images: [
        {
          url: product.featuredImage.url,
          width: product.featuredImage.width,
          height: product.featuredImage.height,
          alt: product.title,
        },
      ],
      locale: 'es_MX',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [product.featuredImage.url],
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
  const fbc = cookieStore.get('_fbc')?.value;
  const f_external_id_me = user.f_external_id;
  const f_external_id_cookie = cookieStore.get('f_external_id')?.value;
  const f_external_id = Math.random().toString(36).substring(2);
  const date = Date.now();
  const current_timestamp = Math.floor(date / 1000);

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

  const url = new URL(
    `Colecciones/${product.featureCollection?.slug}/${product.handle}`,
    baseUrl,
  ).toString();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    productID: product.handle,
    name: product.title,
    description: product.descriptionHtml,
    image: product.featuredImage.url,
    brand: { '@type': 'Brand', name: 'Proyecto 705' },
    offers: {
      '@type': 'Offer',
      price: product.priceRange.maxVariantPrice.amount,
      priceCurrency: product.priceRange.maxVariantPrice.currencyCode,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      url: url,
    },
  };

  return (
    <>
      <script
        id="schema-org-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FacebookConversionApi
        ip={ip}
        userAgent={userAgent}
        fbc={fbc}
        fbp={fbp}
        fbclid={fbclid}
        eventName="ViewContent"
        eventId={eventId}
        email={user.email || null}
        phone={user.address.phone || null}
        productID={product.handle}
        value={product.priceRange.maxVariantPrice.amount}
        eventURL={`${baseUrl}/${pathname}`}
        SHOP_PUBLIC_URL={baseUrl || ''}
        f_external_id_cookie={f_external_id_cookie}
        f_external_id={f_external_id}
        f_external_id_me={f_external_id_me}
        current_timestamp={current_timestamp}
        user_id={user.id || null}
      />
      <ProductView
        content_ids={[product.handle]}
        event_id={eventId}
        value={product.priceRange.maxVariantPrice.amount}
      />
      <Whatsapp />
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
