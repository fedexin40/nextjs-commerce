'use client';

import { sendMetaCapiEvent } from '#/actions/facebook';
import { addItem, lastCheckout } from 'actions/cart';
import clsx from 'clsx';
import { CurrentPerson, Product, ProductVariant } from 'lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { cartActions } from 'stores/cart';
import { generateEventId } from '../FacebookPixel';

export function BuyNow({
  product,
  availableForSale,
  currentUser,
}: {
  product: Product;
  availableForSale: boolean;
  currentUser: CurrentPerson;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fbclid = searchParams?.get('fbclid') || undefined;
  const [isPendingBuyNow, startTransitionBuyNow] = useTransition();
  const [isPendingAdd2Cart, startTransitionAdd2Cart] = useTransition();
  const [ErrorMessage, setErrorMessage] = useState('');
  const { openMenu } = cartActions();
  const variants = product.variants;
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams?.get(option.name.toLowerCase()),
    ),
  );

  const date = Date.now();
  const current_timestamp = Math.floor(date / 1000);
  const event_id = `${generateEventId()}_'AddToCart'_${current_timestamp}`;

  const selectedVariantId = variant?.id || defaultVariantId;
  const title = !availableForSale
    ? 'Out of stock'
    : !selectedVariantId
      ? 'Please select options'
      : undefined;

  return (
    <>
      <div>
        {ErrorMessage && (
          <div className="payment-message pb-5 font-semibold uppercase text-red-700">
            {ErrorMessage}
          </div>
        )}
        <button
          aria-label="Comprar ahora"
          disabled={isPendingBuyNow || isPendingAdd2Cart || !availableForSale}
          title={title}
          onClick={() => {
            // Safeguard in case someone messes with `disabled` in devtools.
            if (!availableForSale) return;
            startTransitionBuyNow(async () => {
              if (!selectedVariantId) {
                // Trigger the error boundary in the root error.js
                startTransitionBuyNow(() => {
                  setErrorMessage('Por favor seleccione el tamaño y los kilates de su producto');
                });
                return;
              }
              const error = await addItem(selectedVariantId);
              if (error) {
                // Trigger the error boundary in the root error.js
                startTransitionBuyNow(() => {
                  setErrorMessage(error.toString());
                });
                return;
              }
              window.fbq(
                'track',
                'AddToCart',
                {
                  content_ids: [product.handle],
                  content_type: 'product',
                  currency: 'MXN',
                  value: variant?.price.amount || product.priceRange.maxVariantPrice.amount,
                },
                {
                  eventID: event_id,
                },
              );
              const products = {
                handle: product.handle,
                quantity: 1,
              };
              sendMetaCapiEvent({
                event_name: 'AddToCart',
                fbclid: fbclid,
                value: variant?.price.amount || product.priceRange.maxVariantPrice.amount,
                event_id: event_id,
                email: currentUser.email,
                phone: currentUser.address.phone,
                current_timestamp: current_timestamp,
                current_timestamp_miliseconds: date,
                products: [products],
              });
              // Get cart
              const cart = await lastCheckout();
              router.replace(cart?.checkoutUrl || '/');
            });
          }}
          className={clsx(
            'relative flex h-[60px] w-full items-center justify-center bg-[#c9aa9e] p-4 tracking-wider text-black hover:opacity-90',
            {
              'cursor-not-allowed opacity-60 hover:opacity-60': !availableForSale,
              hidden: isPendingBuyNow,
            },
          )}
        >
          <span className="uppercase">{availableForSale ? 'Comprar ahora' : 'Out Of Stock'}</span>
        </button>
        <div
          className={clsx(
            'relative flex h-[60px] w-full items-center justify-center space-x-6 bg-[#c9aa9e] p-4 tracking-wider',
            {
              hidden: !isPendingBuyNow,
            },
          )}
        >
          <div className="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
          <div className="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
          <div className="h-4 w-4 animate-bounce rounded-full bg-white"></div>
        </div>
      </div>
      <div>
        <button
          disabled={isPendingAdd2Cart || isPendingBuyNow || !availableForSale}
          title={title}
          onClick={() => {
            // Safeguard in case someone messes with `disabled` in devtools.
            if (!availableForSale) return;

            startTransitionAdd2Cart(async () => {
              if (!selectedVariantId) {
                // Trigger the error boundary in the root error.js
                startTransitionAdd2Cart(() => {
                  setErrorMessage('Por favor seleccione el tamaño y los kilates de su producto');
                });
                return;
              }
              const error = await addItem(selectedVariantId);
              if (error) {
                // Trigger the error boundary in the root error.js
                startTransitionAdd2Cart(() => {
                  setErrorMessage(error.toString());
                });
                return;
              }
              window.fbq(
                'track',
                'AddToCart',
                {
                  content_ids: [product.handle],
                  content_type: 'product',
                  currency: 'MXN',
                  value: variant?.price.amount || product.priceRange.maxVariantPrice.amount,
                },
                {
                  eventID: event_id,
                },
              );
              const products = {
                handle: product.handle,
                quantity: 1,
              };
              sendMetaCapiEvent({
                event_name: 'AddToCart',
                fbclid: fbclid,
                value: variant?.price.amount || product.priceRange.maxVariantPrice.amount,
                event_id: event_id,
                email: currentUser.email,
                phone: currentUser.address.phone,
                current_timestamp: current_timestamp,
                current_timestamp_miliseconds: date,
                products: [products],
              });
              router.refresh();
              startTransitionAdd2Cart(() => {
                openMenu();
              });
            });
          }}
          className={clsx(
            'relative flex h-[60px] w-full items-center justify-center bg-[#f5e1d1] p-4 tracking-wider text-black hover:opacity-90',
            {
              'cursor-not-allowed opacity-60 hover:opacity-60': !availableForSale,
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
            'relative flex h-[60px] w-full items-center justify-center space-x-6 bg-[#f5e1d1] p-4 tracking-wider',
            {
              hidden: !isPendingAdd2Cart,
            },
          )}
        >
          <div className="h-4 w-4 animate-bounce rounded-full bg-[hsl(28,30%,59%)] [animation-delay:-0.3s]"></div>
          <div className="h-4 w-4 animate-bounce rounded-full bg-[hsl(28,30%,59%)] [animation-delay:-0.15s]"></div>
          <div className="h-4 w-4 animate-bounce rounded-full bg-[hsl(28,30%,59%)]"></div>
        </div>
      </div>
    </>
  );
}
