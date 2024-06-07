'use client';

import clsx from 'clsx';
import { shippingAddressUpdate } from 'components/shipping/actions';
import { useShipping } from 'components/shipping/store';
import { useCountryArea, usePostalCode, useUser } from 'components/user/after-login/store';
import { billingAddressCheckoutUpdate } from 'lib/saleor';
import { useTransition } from 'react';
import { deliveryMethodUpdate } from './actions';

export default function Button({ checkoutId }: { checkoutId: string }) {
  const [isPending, startTransition] = useTransition();
  const deliveryMethodId = useShipping().selectedShippingId;
  const postalCode = usePostalCode().postalCode;
  const countryArea = useCountryArea().countryArea;
  const userStore = useUser();

  function setupShippingAddress() {
    startTransition(async () => {
      const input = {
        checkoutId: checkoutId,
        streetAddress1: userStore.streetAddress1,
        streetAddress2: userStore.streetAddress2,
        city: userStore.city,
        postalCode: postalCode,
        countryArea: countryArea,
        firstName: userStore.firstName,
        lastName: userStore.lastName,
        phone: userStore.phone,
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const error = await shippingAddressUpdate(input);
      if (!error) {
        deliveryMethodUpdate({ checkoutId, deliveryMethodId });
        billingAddressCheckoutUpdate(input);
      }
    });
  }

  if (!deliveryMethodId) {
    return (
      <div className="mt-10 h-[50px] w-1/4 cursor-not-allowed bg-black p-3 text-center font-semibold text-white opacity-50">
        Siguiente
      </div>
    );
  }

  return (
    <>
      <div
        className={clsx(
          'mt-10 h-[50px] w-1/4 cursor-pointer bg-black p-3 text-center font-semibold text-white hover:opacity-50',
          { hidden: isPending },
        )}
        onClick={() => setupShippingAddress()}
      >
        Siguiente
      </div>
      <div
        className={clsx(
          'h-50 relative mt-10 flex h-[50px] w-1/4 cursor-not-allowed items-center justify-center space-x-6 bg-black p-3 text-center font-semibold text-white',
          { hidden: !isPending },
        )}
      >
        <div className="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.3s] dark:bg-white"></div>
        <div className="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.15s] dark:bg-white"></div>
        <div className="h-4 w-4 animate-bounce rounded-full bg-white dark:bg-white"></div>
      </div>
    </>
  );
}
