'use client';

import { Alert, Snackbar } from '@mui/material';
import { updateAddress } from 'actions/user';
import clsx from 'clsx';
import { CurrentPerson, countryAreaChoices as countryAreaChoicesType } from 'lib/types';
import { useState, useTransition } from 'react';
import { useUser } from 'stores/user';
import AddressInput from './address-form';

export default function Address({
  user,
  countryAreaChoices,
}: {
  user: CurrentPerson;
  countryAreaChoices: countryAreaChoicesType;
}) {
  const [isError, setError] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const closeError = () => setError(false);
  const openError = () => setError(true);
  const userStore = useUser();

  function saveAddress() {
    startTransition(async () => {
      // Read the input parameters from the form
      const input = {
        firstName: userStore.firstName,
        lastName: userStore.lastName,
        streetAddress1: userStore.streetAddress1,
        streetAddress2: userStore.streetAddress2,
        city: userStore.city,
        postalCode: userStore.postalCode,
        countryArea: userStore.countryArea || user.address.countryArea,
        phone: userStore.phone,
      };
      console.log(input);
      // Update the address if the user already has one
      const errors = await updateAddress(input);
      if (errors) {
        openError();
        setErrorMessage(errors);
      }
    });
  }

  return (
    <>
      <form className="pb-9 text-xs lg:text-sm" action={saveAddress}>
        <div className="flex flex-col gap-3">
          <div>
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={isError}
              autoHideDuration={6000}
              onClose={closeError}
            >
              <Alert onClose={closeError} severity="error" variant="filled" sx={{ width: '100%' }}>
                {ErrorMessage}
              </Alert>
            </Snackbar>
          </div>
          <div className="pb-8">
            <AddressInput user={user} countryAreaChoices={countryAreaChoices} />
          </div>
          <div
            className={clsx(
              'flex h-[60px] w-[200px] cursor-pointer items-center justify-center whitespace-nowrap bg-black p-3 font-semibold uppercase text-white hover:opacity-50 dark:bg-[#c9aa9e]',
              { hidden: isPending },
            )}
            onClick={() => saveAddress()}
          >
            Guardar
          </div>
          <div
            className={clsx(
              'relative flex h-[60px] w-[200px] cursor-not-allowed items-center justify-center space-x-6 whitespace-nowrap bg-black p-3 text-center font-semibold text-white dark:bg-[#c9aa9e]',
              { hidden: !isPending },
            )}
          >
            <div className="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.3s] dark:bg-white"></div>
            <div className="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.15s] dark:bg-white"></div>
            <div className="h-4 w-4 animate-bounce rounded-full bg-white dark:bg-white"></div>
          </div>
        </div>
      </form>
    </>
  );
}
