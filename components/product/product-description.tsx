import { Me } from '#/lib/saleor';
import { BuyNow } from 'components/cart/buy-now';
import Price from 'components/price';
import { Product, ProductVariant } from 'lib/types';
import Image from 'next/image';
import { Rating } from '../prisma';
import { VariantSelector } from './variant-selector';

export async function ProductDescription({
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
  const currentUser = await Me();

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
          <a href="#customer-reviews">
            <Rating productId={product.id} />
          </a>
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
          <a href="#customer-reviews">
            <Rating productId={product.id} />
          </a>
        </div>
      </div>
      <div className="flex flex-col border-b pb-6">
        <VariantSelector options={product.options} variants={product.variants} />
      </div>
      <div className="mt-6 flex flex-col gap-5 border-b pb-6 uppercase">
        <BuyNow
          product={product}
          availableForSale={product.availableForSale}
          currentUser={currentUser}
        />
      </div>
      <div className="flex flex-col gap-y-4 pt-5 text-left text-[12px] leading-[20px] text-gray-800">
        <div>Tiempo de entrega de 2 a 7 dias hábiles</div>
        <div className="font-medium">Envío gratis en compras mayores a $1,000.00</div>
        <div className="flex flex-row gap-x-4">
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
        <div className="text-[15px] font-semibold">Métodos de Pago</div>
        <div className="grid grid-cols-4 pt-5 md:grid-cols-3 md:pt-8 lg:grid-cols-4">
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
          <div className="relative h-[70px] w-[70px]">
            <Image
              className="object-contain"
              src={'/msi.png'}
              alt="Meses sin intereses"
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
            />
          </div>
          <div className="relative h-[60px] w-[60px]">
            <Image
              className="object-contain"
              src={'/oxxo.png'}
              alt="Metodo de pago, oxxo"
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
            />
          </div>
          <div className="relative h-[60px] w-[60px]">
            <Image
              className="object-contain"
              src={'/spei.png'}
              alt="Metodo de pago, spei"
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
            />
          </div>
          <div className="relative h-[60px] w-[60px]">
            <Image
              className="object-contain"
              src={'/paypal.png'}
              alt="Metodo de pago, paypal"
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
            />
          </div>
          <div className="relative h-[65px] w-[65px]">
            <Image
              className="object-contain"
              src={'/apple.jpg'}
              alt="Metodo de pago, Apple pay"
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
            />
          </div>
          <div className="relative h-[60px] w-[60px]">
            <Image
              className="object-contain"
              src={'/GooglePay.png'}
              alt="Metodo de pago, Google pay"
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
