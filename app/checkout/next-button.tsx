'use client';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import clsx from 'clsx';
import { shippingAddressUpdate } from 'components/shipping/actions';
import { useShipping } from 'components/shipping/store';
import { useUser } from 'components/user/after-login/store';
import { billingAddressCheckoutUpdate } from 'lib/saleor';
import { CurrentPerson } from 'lib/types';
import { useState, useTransition } from 'react';
import { deliveryMethodUpdate } from './actions';

export default function Button({ checkoutId, user }: { checkoutId: string; user: CurrentPerson }) {
  const [isPending, startTransition] = useTransition();
  const deliveryMethodId = useShipping().selectedShippingId;
  const userStore = useUser();
  const [ErrorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);
  const closeError = () => setError(false);
  const openError = () => setError(true);

  function setupShippingAddress() {
    startTransition(async () => {
      const input = {
        checkoutId: checkoutId,
        streetAddress1: userStore.streetAddress1 || user.address.streetAddress1 || '',
        streetAddress2: userStore.streetAddress2 || user.address.streetAddress2 || '',
        city: userStore.city || user.address.city || '',
        postalCode: userStore.postalCode || user.address.postalCode || '',
        countryArea: userStore.countryArea || user.address.countryArea || '',
        firstName: userStore.firstName || user.firstName || '',
        lastName: userStore.lastName || user.lastName || '',
        phone: userStore.phone || user.address.phone || '',
      };
      console.log(input);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const error = await shippingAddressUpdate(input);
      if (!error) {
        const errorMethodUpdate = await deliveryMethodUpdate({ checkoutId, deliveryMethodId });
        if (errorMethodUpdate) {
          console.log('error en deliveryMethodUpdate');
          setErrorMessage(errorMethodUpdate);
          openError();
        } else {
          billingAddressCheckoutUpdate(input);
        }
      } else {
        console.log('error en shippingAddressUpdate');
        setErrorMessage(error);
        openError();
      }
    });
  }

  if (!deliveryMethodId) {
    return (
      <div className="h-[50px] cursor-not-allowed whitespace-nowrap bg-black p-3 text-center font-semibold text-white opacity-50 dark:bg-[#c9aa9e] md:w-1/3 lg:w-1/4">
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
          'h-[50px] cursor-pointer whitespace-nowrap bg-black p-3 text-center font-semibold text-white hover:opacity-50 dark:bg-[#c9aa9e] md:w-1/3 lg:w-1/4',
          { hidden: isPending },
        )}
        onClick={() => setupShippingAddress()}
      >
        Siguiente
      </div>
      <div
        className={clsx(
          'relative flex h-[50px] cursor-not-allowed items-center justify-center space-x-6 whitespace-nowrap bg-black p-3 text-center font-semibold text-white dark:bg-[#c9aa9e] md:w-1/3 lg:w-1/4',
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
