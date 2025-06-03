'use client';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { addItem, lastCheckout } from 'actions/cart';
import clsx from 'clsx';
import { ProductVariant } from 'lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { cartActions } from 'stores/cart';

export function BuyNow({
  variants,
  availableForSale,
  content_ids,
  value,
}: {
  variants: ProductVariant[];
  availableForSale: boolean;
  content_ids: string[];
  value: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPendingBuyNow, startTransitionBuyNow] = useTransition();
  const [isPendingAdd2Cart, startTransitionAdd2Cart] = useTransition();
  const [isError, setIsError] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState('');
  const { openMenu } = cartActions();
  const closeError = () => {
    setIsError(false);
  };
  const openError = () => {
    setIsError(true);
  };
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams?.get(option.name.toLowerCase()),
    ),
  );

  const selectedVariantId = variant?.id || defaultVariantId;
  const title = !availableForSale
    ? 'Out of stock'
    : !selectedVariantId
    ? 'Please select options'
    : undefined;

  return (
    <>
      <div>
        <div>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isError}
            autoHideDuration={6000}
            onClose={closeError}
          >
            <Alert onClose={closeError} severity="error" variant="filled" sx={{ width: '100%' }}>
              {ErrorMessage}
            </Alert>
          </Snackbar>
        </div>
        <button
          aria-label="Comprar ahora"
          disabled={isPendingBuyNow || isPendingAdd2Cart || !availableForSale || !selectedVariantId}
          title={title}
          onClick={() => {
            // Safeguard in case someone messes with `disabled` in devtools.
            if (!availableForSale || !selectedVariantId) return;
            startTransitionBuyNow(async () => {
              if (!variant) {
                // Trigger the error boundary in the root error.js
                startTransitionBuyNow(() => {
                  setErrorMessage('Por favor seleccione el tamaño y los kilates de su producto');
                  openError();
                });
                return;
              }
              const error = await addItem(selectedVariantId);
              if (error) {
                // Trigger the error boundary in the root error.js
                startTransitionBuyNow(() => {
                  setErrorMessage(error.toString());
                  openError();
                });
                return;
              }
              // Get cart
              const cart = await lastCheckout();
              window.fbq('track', 'AddToCart', {
                content_ids: content_ids,
                content_type: 'product',
                currency: 'MXN',
                value: value,
              });
              router.push(cart?.checkoutUrl || '/');
            });
          }}
          className={clsx(
            'relative flex h-[60px] w-full items-center justify-center  bg-[#c9aa9e] p-4 tracking-wider text-black hover:opacity-90',
            {
              'cursor-not-allowed opacity-60 hover:opacity-60':
                !availableForSale || !selectedVariantId,
              hidden: isPendingBuyNow,
            },
          )}
        >
          <span className="uppercase">{availableForSale ? 'Comprar ahora' : 'Out Of Stock'}</span>
        </button>
        <div
          className={clsx(
            'relative flex h-[60px] w-full items-center justify-center space-x-6 bg-[#c9aa9e] p-4 tracking-wider dark:border-2 dark:border-[#c9aa9e] dark:text-white',
            {
              hidden: !isPendingBuyNow,
            },
          )}
        >
          <div className="h-4 w-4 animate-bounce rounded-full bg-[hsl(28,30%,59%)] [animation-delay:-0.3s] dark:bg-white"></div>
          <div className="h-4 w-4 animate-bounce rounded-full bg-[hsl(28,30%,59%)] [animation-delay:-0.15s] dark:bg-white"></div>
          <div className="h-4 w-4 animate-bounce rounded-full bg-[hsl(28,30%,59%)] dark:bg-white"></div>
        </div>
      </div>
      <div>
        <button
          disabled={isPendingAdd2Cart || isPendingBuyNow || !availableForSale || !selectedVariantId}
          title={title}
          onClick={() => {
            // Safeguard in case someone messes with `disabled` in devtools.
            if (!availableForSale || !selectedVariantId) return;

            startTransitionAdd2Cart(async () => {
              if (!variant) {
                // Trigger the error boundary in the root error.js
                startTransitionAdd2Cart(() => {
                  setErrorMessage('Por favor seleccione el tamaño y los kilates de su producto');
                  openError();
                });
                return;
              }
              const error = await addItem(selectedVariantId);
              if (error) {
                // Trigger the error boundary in the root error.js
                startTransitionAdd2Cart(() => {
                  setErrorMessage(error.toString());
                  openError();
                });
                return;
              }
              window.fbq('track', 'AddToCart', {
                content_ids: content_ids,
                content_type: 'product',
                currency: 'MXN',
                value: value,
              });
              router.refresh();
              startTransitionAdd2Cart(() => {
                openMenu();
              });
            });
          }}
          className={clsx(
            'relative flex h-[60px] w-full items-center justify-center  bg-[#f5e1d1] p-4 tracking-wider text-black hover:opacity-90 dark:border-2 dark:border-[#c9aa9e] dark:bg-black dark:text-white',
            {
              'cursor-not-allowed opacity-60 hover:opacity-60':
                !availableForSale || !selectedVariantId,
              hidden: isPendingAdd2Cart,
            },
          )}
        >
          <span className="uppercase">
            {availableForSale ? 'Agregar al carrito' : 'Out Of Stock'}
          </span>
        </button>
        <div
          className={clsx(
            'relative flex h-[60px] w-full items-center justify-center space-x-6 bg-[#f5e1d1] p-4 tracking-wider dark:border-2 dark:border-[#c9aa9e]  dark:bg-black dark:text-white',
            {
              hidden: !isPendingAdd2Cart,
            },
          )}
        >
          <div className="h-4 w-4 animate-bounce rounded-full bg-[hsl(28,30%,59%)] [animation-delay:-0.3s] dark:bg-white"></div>
          <div className="h-4 w-4 animate-bounce rounded-full bg-[hsl(28,30%,59%)] [animation-delay:-0.15s] dark:bg-white"></div>
          <div className="h-4 w-4 animate-bounce rounded-full bg-[hsl(28,30%,59%)] dark:bg-white"></div>
        </div>
      </div>
    </>
  );
}
