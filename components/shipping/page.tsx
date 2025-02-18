'use client';

import Skeleton from '@mui/material/Skeleton';
import { shippingAddressUpdate, shippingMethodsAction } from 'actions/shipping';
import { billingAddressCheckoutUpdate } from 'lib/saleor';
import { CurrentPerson } from 'lib/types';
import { useEffect, useState, useTransition } from 'react';
import { useShipping, useShippingActions } from 'stores/shipping';
import { useUser } from 'stores/user';
import ShippingMethods from './shipping';
import ShippingFree from './shipping-free';

export default function Shipping({
  checkoutId,
  user,
  checkoutTotal,
}: {
  checkoutId: string;
  user: CurrentPerson;
  checkoutTotal: string | undefined;
}) {
  const userStore = useUser();
  const [isPending, startTransition] = useTransition();
  const { setShippingMethods } = useShippingActions();
  const { shippingMethods } = useShipping();
  const [error, setError] = useState('');

  useEffect(() => {
    const methodShipping = async () => {
      const input = {
        checkoutId: checkoutId,
        streetAddress1: userStore.streetAddress1 || user.address.streetAddress1 || '',
        streetAddress2: userStore.streetAddress2 || user.address.streetAddress2 || '',
        city: userStore.city || user.address.city || '',
        postalCode: userStore.postalCode || user.address.postalCode || '',
        countryArea: userStore.countryArea || user.address.countryArea,
        firstName: userStore.firstName || user.firstName || '',
        lastName: userStore.lastName || user.lastName || '',
        phone: userStore.phone || user.address.phone || '',
      };
      if (!userStore.phone && !user.address.phone) {
        setError('Por favor ingresa tu número telefónico');
        return;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      let error = await shippingAddressUpdate(input);
      if (!error) {
        error = billingAddressCheckoutUpdate(input);
        if (!error) {
          setError(error);
          console.log('error in updating billing address');
          return;
        }
        const shippingMethods = await shippingMethodsAction({ checkoutId });
        setShippingMethods(shippingMethods || []);
        setError('');
      } else {
        setError(error);
      }
    };
    startTransition(() => {
      methodShipping();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userStore.city,
    userStore.countryArea,
    userStore.streetAddress1,
    userStore.streetAddress2,
    userStore.postalCode,
    userStore.phone,
  ]);

  if (isPending) {
    return (
      <div className="w-full">
        <div className="flex flex-col space-y-4 md:space-y-8 lg:space-y-14">
          <div className="flex flex-row space-x-2">
            <span>Cargando</span>
            <div className="flex flex-row space-x-2 self-end">
              <div className="-mt-1 h-[6px] w-[6px] animate-bounce rounded-full bg-black [animation-delay:-0.3s] dark:bg-white lg:-mt-3 lg:h-[8px] lg:w-[8px]"></div>
              <div className="-mt-1 h-[6px] w-[6px] animate-bounce rounded-full bg-black [animation-delay:-0.15s] dark:bg-white lg:-mt-3 lg:h-[8px] lg:w-[8px]"></div>
              <div className="-mt-1 h-[6px] w-[6px] animate-bounce rounded-full bg-black dark:bg-white lg:-mt-3 lg:h-[8px] lg:w-[8px]"></div>
            </div>
          </div>
          <div className="flex animate-pulse flex-col space-y-2">
            <Skeleton animation={'pulse'} />
            <Skeleton animation={'pulse'} />
            <Skeleton animation={'wave'} />
          </div>
          <div className="hidden animate-pulse flex-col space-y-2 md:flex">
            <Skeleton animation={'pulse'} />
            <Skeleton animation={'pulse'} />
            <Skeleton animation={'wave'} />
          </div>
          <div className="hidden animate-pulse flex-col space-y-2 md:flex">
            <Skeleton animation={'pulse'} />
            <Skeleton animation={'pulse'} />
            <Skeleton animation={'wave'} />
          </div>
          <div className="hidden animate-pulse flex-col space-y-2 md:flex">
            <Skeleton animation={'pulse'} />
            <Skeleton animation={'pulse'} />
            <Skeleton animation={'wave'} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="space-y-5 leading-8 md:text-left lg:leading-10">{error}</div>;
  }

  if (shippingMethods.length > 0) {
    shippingMethods.sort((y, x) => y.price - x.price);
    if (Number(checkoutTotal) > 1500) {
      return <ShippingFree ShippingMethods={shippingMethods} />;
    }
    return <ShippingMethods ShippingMethods={shippingMethods} />;
  }

  return (
    <div className="space-y-5 leading-8	md:text-left lg:leading-10">
      Por favor ingresa una direccion correcta para poder calcular los envios disponibles.
    </div>
  );
}
