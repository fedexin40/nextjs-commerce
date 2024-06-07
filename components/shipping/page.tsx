'use client';

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
    return <>Estoy cargando</>;
  }

  if (shippingMethods) {
    return <ShippingMethods ShippingMethods={shippingMethods} />;
  }

  return <>El codigo postal o la direccion no son correctos</>;
}
