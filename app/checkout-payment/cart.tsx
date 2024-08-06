'use client';

import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import type { Cart as CartType } from 'lib/types';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import DeleteItemButton from './delete-item-button';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function Cart({ cart }: { cart: CartType | null }) {
  // It is impossible to be here without a car, or at least I think
  // that's why I am only returning
  if (!cart) {
    return <div />;
  }
  let deliveryPrice = Number(cart.cost.totalAmount.amount);
  cart.lines.map((item) => {
    deliveryPrice -= Number(item.cost.totalAmount.amount) * item.quantity;
  });

  return (
    <>
      <div className="flex h-full flex-col justify-between overflow-hidden pb-20">
        <ul className="flex flex-col gap-3 overflow-auto lg:gap-5">
          {cart.lines.map((item, i) => {
            const merchandiseSearchParams = {} as MerchandiseSearchParams;

            item.merchandise.selectedOptions.forEach(({ name, value }) => {
              if (value !== DEFAULT_OPTION) {
                merchandiseSearchParams[name.toLowerCase()] = value;
              }
            });

            const merchandiseUrl = createUrl(
              `/product/${item.merchandise.product.handle}`,
              new URLSearchParams(merchandiseSearchParams),
            );

            return (
              <div
                key={i}
                className="flex w-full flex-col rounded-md border-2 border-[#acacac] px-3 dark:border-[#c9aa9e]"
              >
                <div className="relative flex w-full flex-row justify-around px-1 py-4">
                  <div className="w-2/3">
                    <Link href={merchandiseUrl} className="flex flex-row justify-between">
                      <div className="flex w-full flex-row justify-around space-x-2">
                        <div className="relative overflow-hidden rounded-md md:h-8 md:w-8 lg:h-16 lg:w-16">
                          <Image
                            className="md:object-contain lg:object-cover"
                            fill
                            alt={
                              item.merchandise.product.featuredImage.altText ||
                              item.merchandise.product.title
                            }
                            src={item.merchandise.product.featuredImage.url}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="pb-3 leading-tight">
                            {item.merchandise.product.title}
                          </span>
                          {item.merchandise.title !== DEFAULT_OPTION ? (
                            <p className="text-neutral-500 dark:text-neutral-400">
                              {item.merchandise.title}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="flex w-1/3 flex-col justify-between">
                    <Price
                      className="flex justify-end space-y-2 text-right"
                      amountMax={item.cost.totalAmount.amount}
                      currencyCode={item.cost.totalAmount.currencyCode}
                    />
                    <div className="flex place-content-center hover:cursor-pointer">
                      <DeleteItemButton item={item} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </ul>
        <div className="flex w-full flex-row gap-3 pt-7">
          <input
            className="w-3/4 border-2 border-neutral-300 bg-[#f1f1f1] pl-2 dark:border dark:border-[#c9aa9e]"
            placeholder="Codigo de cupon..."
          />
          <div className="w-1/4 bg-neutral-500 p-3 text-center text-white dark:bg-[#c9aa9e] dark:text-black">
            Aplicar
          </div>
        </div>
        <div className="pb-7 text-neutral-500 dark:text-white">
          <div className="mb-2 flex items-center justify-between border-[#acacac] pb-1 pt-5 uppercase text-black dark:border-[#c9aa9e] dark:text-white">
            <p>Envío</p>
            <p className="text-right text-black dark:text-white">${deliveryPrice}</p>
          </div>
          <div className="mb-2 flex items-center justify-between border-t-2 border-[#acacac] pb-1 pt-5 uppercase text-black dark:border-[#c9aa9e] dark:text-white">
            <p>Subtotal</p>
            <Price
              className="text-black dark:text-white"
              amountMax={cart.cost.subtotalAmount.amount}
              currencyCode={cart.cost.subtotalAmount.currencyCode}
            />
          </div>
          <div className="mb-2 flex items-center justify-between border-t-2 border-[#acacac] pb-1 pt-5 uppercase text-black dark:border-[#c9aa9e] dark:text-white">
            <p>Iva (16%)</p>
            <Price
              className="text-black dark:text-white"
              amountMax={cart.cost.totalTaxAmount.amount}
              currencyCode={cart.cost.totalTaxAmount.currencyCode}
            />
          </div>
          <div className="mb-2 flex items-center justify-between border-t-2 border-[#acacac] pb-1 pt-5 uppercase text-black dark:border-[#c9aa9e] dark:text-white">
            <p>Total</p>
            <Price
              className="text-black dark:text-white"
              amountMax={cart.cost.totalAmount.amount}
              currencyCode={cart.cost.totalAmount.currencyCode}
            />
          </div>
        </div>
      </div>
    </>
  );
}
