import { AddToCart } from 'components/cart/add-to-cart';
import { BuyNow } from 'components/cart/buy-now';
import Price from 'components/price';
import { Product, ProductVariant } from 'lib/types';
import Image from 'next/image';
import { Suspense } from 'react';
import { VariantSelector } from './variant-selector';

export function ProductDescription({
  product,
  variant,
}: {
  product: Product;
  variant: ProductVariant | undefined;
}) {
  let description;
  if (product.metadata?.length) {
    for (let i = 0; i < product.metadata?.length; i++) {
      if (product.metadata[i]?.key == 'description') {
        description = product.metadata[i]?.value;
      }
    }
  } else {
    description = 'Pequeño broquel de oro, esta es una joya perfecta para regalar';
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border-b dark:border-neutral-700">
        <div className="mb-2 dark:text-[#c9aa9e]">
          <h1 className="text-base font-semibold capitalize tracking-wider">{product.title}</h1>
        </div>
        <div className="py-10 text-justify text-[13.5px] tracking-[1.4px] lg:text-[14.3px]">
          {description}
        </div>
        <div className="mr-auto w-auto p-2 pl-0 text-sm tracking-wider dark:text-[#c9aa9e]">
          {variant && (
            <Price
              amountMax={variant.price.amount}
              currencyCode={product.priceRange.minVariantPrice.currencyCode}
            />
          )}
          {!variant && (
            <Price
              amountMax={product.priceRange.maxVariantPrice.amount}
              amountMin={product.priceRange.minVariantPrice.amount}
              currencyCode={product.priceRange.minVariantPrice.currencyCode}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col border-b pb-6 dark:border-neutral-700">
        <VariantSelector options={product.options} variants={product.variants} />
      </div>
      <div className="mt-6 flex flex-col gap-5 border-b pb-6 uppercase dark:border-neutral-700">
        <BuyNow variants={product.variants} availableForSale={product.availableForSale} />
        <Suspense>
          <AddToCart variants={product.variants} availableForSale={product.availableForSale} />
        </Suspense>
      </div>
      <div className="pt-5 text-left text-[10px] leading-tight text-gray-800 dark:text-white lg:text-[13px]">
        <div className="whitespace-nowrap">Tiempo de entrega de 2 a 7 dias hábiles</div>
        <div className="whitespace-nowrap pt-3">Envío gratis en compras mayores a $1,500.00</div>
        <div className="flex flex-row gap-x-4 whitespace-nowrap pt-3">
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
      <div className="flex flex-col pt-14 text-[13.5px] tracking-[1.4px] lg:text-[14.3px]">
        <div className="text-[15px] font-semibold	">Metodos de Pago</div>
        <div className="pt-10">
          Tarjeta
          <div className="flex flex-row gap-5">
            <Suspense>
              <div className="relative h-[60px] w-[60px]">
                <Image
                  className="object-contain"
                  src={'/visa2.png'}
                  alt="Metodo de pago, visa"
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                />
              </div>
            </Suspense>
            <Suspense>
              <div className="relative h-[60px] w-[60px]">
                <Image
                  className="object-contain"
                  src={'/mastercard2.png'}
                  alt="Metodo de pago, mastercad"
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                />
              </div>
            </Suspense>
          </div>
        </div>
        <div className="pt-10">
          Efectivo
          <div className="flex flex-row gap-5">
            <Suspense>
              <div className="relative h-[60px] w-[60px]">
                <Image
                  className="object-contain"
                  src={'/oxxo.png'}
                  alt="Metodo de pago, oxxo"
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                />
              </div>
            </Suspense>
          </div>
        </div>
        <div className="pt-10">
          Transferencia Bancaria
          <div className="flex flex-row gap-5">
            <Suspense>
              <div className="relative h-[60px] w-[60px]">
                <Image
                  className="object-contain"
                  src={'/spei.png'}
                  alt="Metodo de pago, spei"
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                />
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
