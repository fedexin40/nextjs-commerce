import { BuyNow } from 'components/cart/buy-now';
import Price from 'components/price';
import { Product, ProductVariant } from 'lib/types';
import Image from 'next/image';
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

  // Used for facebook pixel
  const content_ids = [product.handle];
  const value = product.priceRange.maxVariantPrice.amount;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border-b">
        <div className="mb-2">
          <h1 className="text-base font-semibold capitalize tracking-wider">{product.title}</h1>
        </div>
        <div className="mr-auto block w-auto p-2 pl-0 text-[13.5px] font-semibold tracking-[1.4px] md:hidden lg:text-[14.3px]">
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
        <div className="pb-5 text-justify text-[13.5px] tracking-[1.4px] lg:text-[14.3px]">
          {description}
        </div>
        <div className="mr-auto hidden w-auto p-2 pl-0 pt-5 text-[13.5px] font-semibold tracking-[1.4px] md:block lg:text-[14.3px]">
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
      <div className="flex flex-col border-b pb-6">
        <VariantSelector options={product.options} variants={product.variants} />
      </div>
      <div className="mt-6 flex flex-col gap-5 border-b pb-6 uppercase">
        <BuyNow
          variants={product.variants}
          availableForSale={product.availableForSale}
          content_ids={content_ids}
          value={value}
        />
      </div>
      <div className="pt-5 text-left text-[12px] leading-tight text-gray-800 lg:text-[14px]">
        <div className="whitespace-nowrap">Tiempo de entrega de 2 a 7 dias hábiles</div>
        <div className="whitespace-nowrap pt-3">Envío gratis en compras mayores a $1,500.00</div>
        <div className="flex flex-row gap-x-4 whitespace-nowrap pt-3">
          <div>Compartir con</div>
          <div className="relative h-[20px] w-[20px]">
            <Image
              className="object-contain"
              src={'/facebook.png'}
              alt=""
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
            />
          </div>
          <div className="relative h-[20px] w-[20px]">
            <Image
              className="object-contain"
              src={'/instagram.png'}
              alt=""
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col pt-14 text-[13.5px] tracking-[1.4px] lg:text-[14.3px]">
        <div className="text-[15px] font-semibold	">Metodos de Pago</div>
        <div className="pt-5 md:pt-8">
          Tarjeta
          <div className="-mt-2 flex flex-row gap-x-5">
            <div className="relative h-[60px] w-[60px]">
              <Image
                className="object-contain"
                src={'/visa2.png'}
                alt="Metodo de pago, visa"
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </div>
            <div className="relative h-[60px] w-[60px]">
              <Image
                className="object-contain"
                src={'/mastercard2.png'}
                alt="Metodo de pago, mastercad"
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
        <div className="pt-5 md:pt-8">
          Efectivo
          <div className="-mt-2 flex flex-row gap-x-5">
            <div className="relative h-[60px] w-[60px]">
              <Image
                className="object-contain"
                src={'/oxxo.png'}
                alt="Metodo de pago, oxxo"
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
        <div className="pt-5 md:pt-8">
          Transferencia Bancaria
          <div className="-mt-2 flex flex-row">
            <div className="relative h-[60px] w-[60px]">
              <Image
                className="object-contain"
                src={'/spei.png'}
                alt="Metodo de pago, spei"
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
