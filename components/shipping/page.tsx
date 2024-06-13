'use client';

import Skeleton from '@mui/material/Skeleton';
import { useCountryArea, usePostalCode, useUser } from 'components/user/after-login/store';
import { useEffect, useTransition } from 'react';
import { shippingAddressUpdate, shippingMethodsAction } from './actions';
import ShippingMethods from './shipping';
import { useShipping, useShippingActions } from './store';

export default function Shipping({ checkoutId }: { checkoutId: string }) {
  const postalCode = usePostalCode().postalCode;
  const countryArea = useCountryArea().countryArea;
  const userStore = useUser();
  const [isPending, startTransition] = useTransition();
  const { setShippingMethods } = useShippingActions();
  const { shippingMethods } = useShipping();

  useEffect(() => {
    const methodShipping = async () => {
      const input = {
        checkoutId: checkoutId,
        streetAddress1: userStore.streetAddress1 || '',
        streetAddress2: userStore.streetAddress2 || '',
        city: userStore.city || '',
        postalCode: postalCode,
        countryArea: countryArea,
        firstName: userStore.firstName || '',
        lastName: userStore.lastName || '',
        phone: userStore.phone || '',
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const error = await shippingAddressUpdate(input);
      if (!error) {
        const shippingMethod = await shippingMethodsAction({ checkoutId });
        setShippingMethods(shippingMethod || []);
      }
    };
    startTransition(() => {
      methodShipping();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setShippingMethods, checkoutId, postalCode, countryArea]);

  if (isPending) {
    return (
      <>
        <div className="flex flex-col space-y-4 md:space-y-8 lg:space-y-14">
          <div className="flex flex-row space-x-2 text-sm lg:text-base">
            <span>Cargando</span>
            <div className="flex flex-row space-x-2 self-end">
              <div className="-mt-1 h-[6px] w-[6px] animate-bounce rounded-full bg-black [animation-delay:-0.3s] dark:bg-white lg:-mt-3 lg:h-[8px] lg:w-[8px]"></div>
              <div className="-mt-1 h-[6px] w-[6px] animate-bounce rounded-full bg-black [animation-delay:-0.15s] dark:bg-white lg:-mt-3 lg:h-[8px] lg:w-[8px]"></div>
              <div className="-mt-1 h-[6px] w-[6px] animate-bounce rounded-full bg-black dark:bg-white lg:-mt-3 lg:h-[8px] lg:w-[8px]"></div>
            </div>
          </div>
          <div className="flex animate-pulse flex-col space-y-2">
            <Skeleton animation={'pulse'} width={300} />
            <Skeleton animation={'pulse'} />
            <Skeleton animation={'wave'} />
          </div>
          <div className="hidden animate-pulse flex-col space-y-2 md:flex">
            <Skeleton animation={'pulse'} width={300} />
            <Skeleton animation={'pulse'} />
            <Skeleton animation={'wave'} />
          </div>
          <div className="hidden animate-pulse flex-col space-y-2 md:flex">
            <Skeleton animation={'pulse'} width={300} />
            <Skeleton animation={'pulse'} />
            <Skeleton animation={'wave'} />
          </div>
          <div className="hidden animate-pulse flex-col space-y-2 md:flex">
            <Skeleton animation={'pulse'} width={300} />
            <Skeleton animation={'pulse'} />
            <Skeleton animation={'wave'} />
          </div>
        </div>
      </>
    );
  }

  if (shippingMethods.length > 0) {
    return <ShippingMethods ShippingMethods={shippingMethods} />;
  }

  return (
    <div className="space-y-5 text-xs leading-8	tracking-wider md:text-left lg:text-sm lg:leading-10">
      Por favor ingresa una direccion correcta para poder calcular los envios disponibles.
    </div>
  );
}
