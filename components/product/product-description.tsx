import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import { Product, ProductVariant } from 'lib/types';
import Image from 'next/image';
import { Suspense } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { VariantSelector } from './variant-selector';

export function ProductDescription({
  product,
  variant,
}: {
  product: Product;
  variant: ProductVariant | undefined;
}) {
  let amount;
  if (!variant) {
    amount = `${product.priceRange.maxVariantPrice.amount} - ${product.priceRange.minVariantPrice.amount}`;
  } else {
    amount = variant?.price.amount;
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border-b dark:border-neutral-700">
        <h1 className="mb-2 font-medium tracking-wider dark:text-[#c9aa9e] md:text-base lg:text-xl">
          {product.title}
        </h1>
        {product.descriptionHtml ? (
          <div className="pb-2 pt-2 text-justify text-xs leading-tight text-gray-500 dark:text-white">
            {ReactHtmlParser(product.descriptionHtml)}
          </div>
        ) : null}
        <div className="mr-auto w-auto p-2 pl-0 tracking-wider dark:text-[#c9aa9e] md:text-base lg:text-lg">
          <Price amount={amount} currencyCode={product.priceRange.minVariantPrice.currencyCode} />
        </div>
      </div>
      <div className="flex flex-col border-b pb-6 dark:border-neutral-700">
        <VariantSelector options={product.options} variants={product.variants} />
      </div>
      <div className="mt-6 flex flex-col gap-5 border-b pb-6 dark:border-neutral-700">
        <div className="flex w-full items-center justify-center bg-[#c9aa9e] p-4 tracking-wider text-black hover:opacity-90">
          Comprar ahora
        </div>
        <Suspense>
          <AddToCart variants={product.variants} availableForSale={product.availableForSale} />
        </Suspense>
      </div>
      <div className="inline pt-6 text-xs leading-tight text-gray-800 dark:text-white">
        <div className="pb-3">Tiempo de entrega de 2 a 7 dias habiles</div>
        <div className="pb-3">Envio gratis a la ciudad de Puebla</div>
        <div className="flex flex-row gap-x-4">
          <div>Compartir con</div>
          <Suspense>
            <div className="relative h-[20px] w-[20px]">
              <Image
                className="object-contain"
                src={'/facebook.png'}
                alt=""
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </div>
          </Suspense>
          <Suspense>
            <div className="relative h-[20px] w-[20px]">
              <Image
                className="object-contain"
                src={'/instagram.png'}
                alt=""
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
