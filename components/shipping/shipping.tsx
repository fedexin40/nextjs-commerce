'use client';

import { RadioGroup } from '@headlessui/react';
import { deliveryMethodUpdate, getCartFromCheckout } from 'actions/checkout';
import clsx from 'clsx';
import { shippingMethod } from 'lib/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useShipping, useShippingActions } from 'stores/shipping';

export default function ShippingMethods({
  ShippingMethods,
  checkoutid,
}: {
  ShippingMethods: shippingMethod[];
  checkoutid: string;
}) {
  const { setSelectedShippingId } = useShippingActions();
  const shipping = useShipping();
  const [isPending, startTransition] = useTransition();
  const { reset } = useShippingActions();
  const [ErrorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  // Delete the shipping states
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function ShippingIdSet({
    shippingId,
    carrierName,
    shippingCost,
  }: {
    shippingId: string;
    carrierName: string;
    shippingCost: number;
  }) {
    setSelectedShippingId(shippingId, carrierName, shippingCost);
  }

  function setupShipping() {
    startTransition(async () => {
      const errorMethodUpdate = await deliveryMethodUpdate({
        checkoutId: checkoutid,
        deliveryMethodId: shipping.selectedShippingId,
        shippingCost: shipping.shippingCost,
        carrierName: shipping.CarrierName,
      });
      if (errorMethodUpdate) {
        startTransition(() => {
          setErrorMessage(errorMethodUpdate);
        });
      } else {
        const cart = await getCartFromCheckout({ checkoutId: checkoutid });
        router.push(cart?.checkoutUrlPayment || '');
      }
    });
  }

  return (
    <div className="w-full">
      <RadioGroup aria-label="shipping method" className="space-y-2" disabled={shipping.isLoading}>
        <div className="w-full space-y-5 lg:space-y-7">
          {ShippingMethods.map((ShippingMethod) => (
            <RadioGroup.Option
              key={ShippingMethod.id}
              value={ShippingMethod.id}
              disabled={isPending}
              onClick={() => {
                ShippingIdSet({
                  shippingId: ShippingMethod.id,
                  carrierName: ShippingMethod.name || '',
                  shippingCost: ShippingMethod.price,
                });
              }}
              className={({ active, checked }) =>
                `${active ? 'ring-2 ring-black ring-offset-2' : ''}
                ${checked ? 'ring-2 ring-black ring-offset-2' : ''}
                  relative flex cursor-pointer rounded-lg bg-gray-200 px-5 py-4 focus:outline-none`
              }
            >
              <div className="flex h-[40px] w-full items-center justify-between lg:h-[50px]">
                <div className="text-[13px] tracking-widest lg:text-[14.3px]">
                  <p className="pb-2 font-semibold text-black opacity-100">{ShippingMethod.name}</p>
                  <div className="flex justify-center text-black opacity-100">
                    <div className="">${ShippingMethod.price}</div>
                    <div aria-hidden="true">&middot;</div>
                    <div className="whitespace-nowrap capitalize">{ShippingMethod.serviceName}</div>
                    <div aria-hidden="true">&middot;</div>
                    <div className="whitespace-nowrap">
                      Max.{ShippingMethod.maximumDeliveryDays} dias
                    </div>
                  </div>
                </div>
              </div>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      <div className="w-full pt-10 md:w-1/2">
        <button className="w-full">
          <div
            onClick={() => setupShipping()}
            className={clsx(
              'flex h-[60px] w-full cursor-pointer items-center justify-center whitespace-nowrap bg-black p-3 font-semibold uppercase text-white hover:opacity-50',
              {
                hidden: isPending || shipping.selectedShippingId == '',
              },
            )}
          >
            Siguiente
          </div>
          <div
            className={clsx(
              'flex h-[60px] w-full cursor-not-allowed items-center justify-center whitespace-nowrap bg-black p-3 font-semibold uppercase text-white opacity-50 hover:opacity-50',
              {
                hidden: isPending || shipping.selectedShippingId != '',
              },
            )}
          >
            Siguiente
          </div>
          <div
            className={clsx(
              'relative flex h-[60px] w-full cursor-not-allowed items-center justify-center space-x-6 whitespace-nowrap bg-black p-3 text-center font-semibold text-white',
              { hidden: !isPending },
            )}
          >
            <div className="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
            <div className="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
            <div className="h-4 w-4 animate-bounce rounded-full bg-white"></div>
          </div>
        </button>
      </div>
      {ErrorMessage && <div className="payment-message pt-5">{ErrorMessage}</div>}
    </div>
  );
}
