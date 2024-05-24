'use client';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import clsx from 'clsx';
import Price from 'components/price';
import { useUser } from 'components/user/after-login/store';
import { DEFAULT_OPTION } from 'lib/constants';
import type { Cart as CartType } from 'lib/types';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { addressBillingCheckoutUpdate } from './actions';
import DeleteItemButton from './delete-item-button';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function Cart({ cart }: { cart: CartType | null }) {
  const userStore = useUser();
  const [isPending, startTransition] = useTransition();
  const [isErrorOpen, useIsErrorOpen] = useState(false);
  const [ErrorMessage, useErrorMessage] = useState('');

  async function handlePayment() {
    const error = await addressBillingCheckoutUpdate({
      url: cart?.checkoutUrlPayment || '',
      checkoutId: cart?.id || '',
      streetAddress1: userStore.streetAddress1,
      streetAddress2: userStore.streetAddress2,
      postalCode: userStore.postalCode,
      countryArea: userStore.countryArea,
      city: userStore.city,
    });
    if (error) {
      console.log(error);
    }
  }
  // It is impossible to be here without a car, or at least I think
  // that's why I am only returning
  if (!cart) {
    return <div />;
  }

  return (
    <>
      <div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isErrorOpen}
          autoHideDuration={6000}
          onClose={() => {}}
        >
          <Alert onClose={() => {}} severity="error" variant="filled" sx={{ width: '100%' }}>
            {ErrorMessage}
          </Alert>
        </Snackbar>
      </div>
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
                className="flex w-full flex-col border-2 border-[#acacac] dark:border-[#c9aa9e]"
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

                    <div className="flex flex-col">
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
                      amount={item.cost.totalAmount.amount}
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
          <div className="mb-2 mt-5 flex items-center justify-between pb-1 dark:border-neutral-700">
            <p>Impuestos</p>
            <Price
              className="text-right text-black dark:text-white"
              amount={cart.cost.totalTaxAmount.amount}
              currencyCode={cart.cost.totalTaxAmount.currencyCode}
            />
          </div>
          <div className="mb-2 flex items-center justify-between pb-1 pt-1 dark:border-neutral-700">
            <p>Envio</p>
            <p className="text-right">Calculado al momento de pagar</p>
          </div>
          <div className="mb-2 flex items-center justify-between border-t-2 border-[#acacac] pb-1 pt-2 text-sm uppercase dark:border-[#c9aa9e] lg:text-base">
            <p>Total</p>
            <Price
              className="text-black dark:text-white"
              amount={cart.cost.totalAmount.amount}
              currencyCode={cart.cost.totalAmount.currencyCode}
            />
          </div>
        </div>
        <div
          className={clsx(
            'block w-full bg-black text-center text-sm font-medium uppercase text-white opacity-90 hover:cursor-pointer hover:opacity-100 dark:bg-[#c9aa9e] md:py-3 lg:py-5',
            {
              hidden: isPending,
            },
          )}
          onClick={async () => {
            startTransition(() => {
              handlePayment();
            });
          }}
        >
          Siguiente
        </div>
        <div
          className={clsx(
            'relative flex w-full items-center justify-center space-x-6 bg-black tracking-wider dark:border-2 dark:border-[#c9aa9e] dark:bg-black dark:text-white  md:py-3 lg:py-5',
            {
              hidden: !isPending,
            },
          )}
        >
          <div className="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.3s] dark:bg-white"></div>
          <div className="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.15s] dark:bg-white"></div>
          <div className="h-4 w-4 animate-bounce rounded-full bg-white dark:bg-white"></div>
        </div>
      </div>
    </>
  );
}
