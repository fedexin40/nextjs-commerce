'use client';

import { Dialog, Transition } from '@headlessui/react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import type { Cart } from 'lib/types';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import { cartActions, useCartOpen } from 'stores/cart';
import CloseCart from './close-cart';
import DeleteItemButton from './delete-item-button';
import EditItemQuantityButton from './edit-item-quantity-button';
import OpenCart from './open-cart';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal({ cart }: { cart: Cart | null | undefined }) {
  const isOpen = useCartOpen();
  const { closeMenu } = cartActions();
  const { openMenu } = cartActions();
  const router = useRouter();
  let total = 0;

  if (cart) {
    cart.lines.map((item) => {
      total += Number(item.cost.totalAmount.amount) * Number(item.quantity);
    });
  }

  return (
    <div className="z-50">
      <div onClick={() => openMenu()}>
        <OpenCart quantity={cart?.totalQuantity} />
      </div>
      <Transition show={isOpen}>
        <Dialog onClose={() => {}} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col bg-white/80 p-6 text-black backdrop-blur-xl dark:border-neutral-700 dark:bg-black/80 dark:text-white md:w-[390px]">
              <div className="flex items-center justify-between border-b-2 border-[hsl(28,30%,59%)] pb-2 pt-10 text-[13px] tracking-widest lg:text-[14.3px]">
                <p className="font-semibold">Mi Carrito</p>

                <button className="" aria-label="Cerrar carrito" onClick={() => closeMenu()}>
                  <CloseCart />
                </button>
              </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden text-[13px] tracking-widest lg:text-[14.3px]">
                  <ShoppingCartIcon className="h-16" />
                  <p className="mt-6 text-center font-bold">Tu carrito esta vacio.</p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden p-1 text-[13px] tracking-widest lg:text-[14.3px]">
                  <ul className="flex-grow overflow-auto py-4">
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
                        <li
                          key={i}
                          className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                        >
                          <div className="relative flex w-full flex-row justify-between px-1 py-4">
                            <div className="absolute z-40 -mt-2 ml-[55px]">
                              <DeleteItemButton item={item} />
                            </div>
                            <Link
                              href={merchandiseUrl}
                              onClick={() => closeMenu()}
                              className="z-30 flex flex-row space-x-4"
                            >
                              <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                <Image
                                  className="h-full w-full object-cover"
                                  width={64}
                                  height={64}
                                  alt={
                                    item.merchandise.product.featuredImage.altText ||
                                    item.merchandise.product.title
                                  }
                                  src={item.merchandise.product.featuredImage.url}
                                />
                              </div>

                              <div className="flex flex-1 flex-col">
                                {item.merchandise.title !== DEFAULT_OPTION ? (
                                  <p className=" text-[13px] tracking-widest lg:text-[14.3px]">
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
                              <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                                <EditItemQuantityButton item={item} type="minus" />
                                <p className="w-6 text-center">
                                  <span className="w-full">{item.quantity}</span>
                                </p>
                                <EditItemQuantityButton item={item} type="plus" />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="py-4 text-neutral-500 dark:text-neutral-400">
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>Envio</p>
                      <p className="text-right">Calculado al momento de pagar</p>
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>Total</p>
                      <Price
                        className="text-right text-black dark:text-white"
                        amountMax={String(total)}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                      />
                    </div>
                  </div>
                  <div
                    className="block w-full bg-[hsl(28,30%,59%)] p-3 text-center font-medium uppercase text-white opacity-90 hover:opacity-100"
                    onClick={() => router.push(cart?.checkoutUrl || '/')}
                  >
                    Pasar a pagar
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
}
