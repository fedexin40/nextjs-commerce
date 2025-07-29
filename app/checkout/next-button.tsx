'use client';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { deliveryMethodUpdate, getCartFromCheckout } from 'actions/checkout';
import { shippingAddressUpdate } from 'actions/shipping';
import clsx from 'clsx';
import { CurrentPerson } from 'lib/types';
import { permanentRedirect } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useShipping, useShippingActions } from 'stores/shipping';
import { useUser } from 'stores/user';

export default function Button({ checkoutId, user }: { checkoutId: string; user: CurrentPerson }) {
  const [isPending, startTransition] = useTransition();
  const deliveryMethodId = useShipping().selectedShippingId;
  const shippingCost = useShipping().shippingCost;
  const carrierName = useShipping().CarrierName;
  const [ErrorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);
  const closeError = () => setError(false);
  const openError = () => setError(true);
  const { reset } = useShippingActions();
  const { setLoading } = useShippingActions();
  const { setNoLoading } = useShippingActions();
  const userStore = useUser();

  // Delete the shipping states
  useEffect(() => {
    reset();
    setNoLoading();
  }, []);

  function setupShippingAddress() {
    startTransition(async () => {
      setLoading();
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

      await shippingAddressUpdate(input);
      const errorMethodUpdate = await deliveryMethodUpdate({
        checkoutId,
        deliveryMethodId,
        shippingCost,
        carrierName,
      });
      if (errorMethodUpdate) {
        startTransition(() => {
          setErrorMessage(errorMethodUpdate);
          openError();
        });
      } else {
        const cart = await getCartFromCheckout({ checkoutId });
        permanentRedirect(cart?.checkoutUrlPayment || '');
      }
      setNoLoading();
    });
  }

  if (!deliveryMethodId) {
    return (
      <div className="flex h-[60px] w-full cursor-not-allowed items-center justify-center whitespace-nowrap bg-black p-3 text-[15.5px] font-semibold uppercase tracking-[1.4px] text-white opacity-50 lg:text-[16.3px]">
        Siguiente
      </div>
    );
  }

  return (
    <>
      <div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={error}
          autoHideDuration={6000}
          onClose={closeError}
        >
          <Alert onClose={closeError} severity="error" variant="filled" sx={{ width: '100%' }}>
            {ErrorMessage}
          </Alert>
        </Snackbar>
      </div>
      <div
        className={clsx(
          'flex h-[60px] w-full cursor-pointer items-center justify-center whitespace-nowrap bg-black p-3 font-semibold uppercase text-white hover:opacity-50',
          { hidden: isPending },
        )}
        onClick={() => setupShippingAddress()}
      >
        Siguiente
        <div className="hidden">{deliveryMethodId}</div>
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
    </>
  );
}
