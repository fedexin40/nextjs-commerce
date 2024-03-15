import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import { Product } from 'lib/types';
import Image from 'next/image';
import ReactHtmlParser from 'react-html-parser';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col border-b dark:border-neutral-700">
        <h1 className="mb-2 font-medium tracking-wider md:text-base lg:text-xl">{product.title}</h1>
        {product.descriptionHtml ? (
          <div className="pb-2 pt-2 text-justify text-xs leading-tight text-gray-500">
            {ReactHtmlParser(product.descriptionHtml)}
          </div>
        ) : null}
        <div className="mr-auto w-auto p-2 pl-0 tracking-wider md:text-base lg:text-lg">
          <Price
            amount={product.priceRange.minVariantPrice.amount}
            currencyCode={product.priceRange.minVariantPrice.currencyCode}
          />
        </div>
      </div>
      <div className="flex flex-col border-b pb-6 dark:border-neutral-700">
        <VariantSelector options={product.options} variants={product.variants} />
      </div>
      <div className="mt-6 flex flex-col gap-5 border-b pb-6 dark:border-neutral-700">
        <div className="flex w-full items-center justify-center bg-[#c9aa9e] p-4 tracking-wider text-black hover:opacity-90">
          Comprar ahora
        </div>
        <AddToCart variants={product.variants} availableForSale={product.availableForSale} />
      </div>
      <div className="pt-6 text-justify text-xs leading-tight text-gray-800">
        <div className="pb-3">Tiempo de entrega de 2 a 7 dias habiles</div>
        <div className="flex flex-row gap-x-4">
          <div>Compartir con</div>
          <Image src={'/facebook.png'} alt="" height={10} width={15} />
          <Image src={'/instagram.png'} alt="" height={10} width={15} />
        </div>
      </div>
    </div>
  );
}
