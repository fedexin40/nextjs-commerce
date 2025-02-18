'use client';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { deliveryMethodUpdate } from 'actions/checkout';
import clsx from 'clsx';
import { CurrentPerson } from 'lib/types';
import { useState, useTransition } from 'react';
import { useShipping } from 'stores/shipping';
import { useUser } from 'stores/user';

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
      const errorMethodUpdate = await deliveryMethodUpdate({ checkoutId, deliveryMethodId });
      if (errorMethodUpdate) {
        setErrorMessage(errorMethodUpdate);
        openError();
      }
    });
  }

  if (!deliveryMethodId) {
    return (
      <div className="flex h-[60px] w-full cursor-not-allowed items-center justify-center whitespace-nowrap bg-black p-3 font-semibold uppercase text-white opacity-50 dark:bg-[#c9aa9e]">
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
