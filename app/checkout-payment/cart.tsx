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
      <div className="flex h-full flex-col justify-between overflow-hidden p-1 pb-20 text-xs tracking-wider lg:text-sm">
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
                <div className="relative flex w-full flex-row justify-between px-1 py-4">
                  <Link href={merchandiseUrl} className="z-30 flex flex-row space-x-4">
                    <div className="relative h-full w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                      <Image
                        className="object-cover"
                        fill
                        alt={
                          item.merchandise.product.featuredImage.altText ||
                          item.merchandise.product.title
                        }
                        src={item.merchandise.product.featuredImage.url}
                      />
                    </div>

                    <div className="flex flex-col place-content-center space-y-2">
                      <span className="leading-tight">{item.merchandise.product.title}</span>
                      {item.merchandise.title !== DEFAULT_OPTION ? (
                        <p className="text-neutral-500 dark:text-neutral-400">
                          {item.merchandise.title}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                  <div className="flex h-16 flex-col justify-between">
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
            className="w-3/4 border-2 border-neutral-300 bg-[#f1f1f1] pl-2 tracking-wider dark:border dark:border-[#c9aa9e]"
            placeholder="Codigo de cupon..."
          />
          <div className="w-1/4 bg-neutral-500 p-3 text-center text-white dark:bg-[#c9aa9e] dark:text-black">
            Aplicar
          </div>
        </div>
        <div className="pb-7 text-neutral-500 dark:text-white">
          <div className="mb-2 mt-10 flex items-center justify-between pb-1 pt-1 text-black dark:border-neutral-700 dark:text-white">
            <p>Envio</p>
            <p className="text-right text-black dark:text-white">${deliveryPrice}</p>
          </div>
          <div className="mb-2 flex items-center justify-between border-t-2 border-[#acacac] pb-1 pt-5 text-sm uppercase text-black dark:border-[#c9aa9e] dark:text-white lg:text-base">
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
