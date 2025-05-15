'use client';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { deliveryMethodUpdate, getCartFromCheckout } from 'actions/checkout';
import clsx from 'clsx';
import { CurrentPerson } from 'lib/types';
import { permanentRedirect } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useShipping, useShippingActions } from 'stores/shipping';

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

  // Delete the shipping states
  useEffect(() => {
    reset();
  }, []);

  function setupShippingAddress() {
    startTransition(async () => {
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
    });
  }

  if (!deliveryMethodId) {
    return (
      <div className="flex h-[60px] w-full cursor-not-allowed items-center justify-center whitespace-nowrap bg-black p-3 text-[15.5px] font-semibold uppercase tracking-[1.4px] text-white opacity-50 dark:bg-[#c9aa9e] lg:text-[16.3px]">
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
          'flex h-[60px] w-full cursor-pointer items-center justify-center whitespace-nowrap bg-black p-3 font-semibold uppercase text-white hover:opacity-50 dark:bg-[#c9aa9e]',
          { hidden: isPending },
        )}
        onClick={() => setupShippingAddress()}
      >
        Siguiente
        <div className="hidden">{deliveryMethodId}</div>
      </div>
      <div
        className={clsx(
          'relative flex h-[60px] w-full cursor-not-allowed items-center justify-center space-x-6 whitespace-nowrap bg-black p-3 text-center font-semibold text-white dark:bg-[#c9aa9e]',
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
