'use client';

import { Alert, Snackbar } from '@mui/material';
import clsx from 'clsx';
import { CurrentPerson, countryAreaChoices as countryAreaChoicesType } from 'lib/types';
import { useState, useTransition } from 'react';
import { useUserDetailsActions } from '../store';
import { createAddress, updateAddress } from './actions';
import AddressInput from './address-input';

export default function Address({
  user,
  countryAreaChoices,
  black,
}: {
  user: CurrentPerson;
  countryAreaChoices: countryAreaChoicesType;
  black?: boolean;
}) {
  const [isError, setError] = useState(false);
  const [ErrorMessage, seterrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const closeError = () => setError(false);
  const openError = () => setError(true);
  const { setUserDetails } = useUserDetailsActions();

  // Save the address into the zustand store
  // this is in order to use the address in any other place
  setUserDetails({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    streetAddress1: user.address.streetAddress1 || '',
    streetAddress2: user.address.streetAddress2 || '',
    postalCode: user.address.postalCode || '',
    city: user.address.city || '',
    // TODO: countryArea is fixed
    countryArea: 'PUE',
    email: user.email,
  });

  function saveAddress(formData: FormData) {
    startTransition(async () => {
      let errors: string | undefined;

      // Read the input parameters from the form
      const rawFormData = {
        firstName: formData.get('firstName')?.toString() || '',
        lastName: formData.get('lastname')?.toString() || '',
        streetAddress1: formData.get('streetAddress1')?.toString() || '',
        streetAddress2: formData.get('streetAddress2')?.toString() || '',
        city: formData.get('city')?.toString() || '',
        postalCode: formData.get('postalcode')?.toString() || '',
        countryArea: formData.get('countryAreaChoice')?.toString() || '',
      };

      // Update the address if the user already has one
      if (user.address.id) {
        errors = await updateAddress({
          id: user.address.id,
          streetAddress1: rawFormData.streetAddress1,
          streetAddress2: rawFormData.streetAddress2,
          city: rawFormData.city,
          postalCode: rawFormData.postalCode,
          countryArea: rawFormData.countryArea,
          firstName: rawFormData.firstName,
          lastName: rawFormData.lastName,
        });
        // If the user does not have an address then create a new one
      } else {
        errors = await createAddress({
          streetAddress1: rawFormData.streetAddress1,
          streetAddress2: rawFormData.streetAddress2,
          city: rawFormData.city,
          postalCode: rawFormData.postalCode,
          countryArea: rawFormData.countryArea,
          firstName: rawFormData.firstName,
          lastName: rawFormData.lastName,
        });
      }
      if (errors) {
        openError();
        seterrorMessage(errors);
      }
      // If all the above process was ok then
      // save the address into the zustand store
      setUserDetails({
        ...rawFormData,
        ...{ email: user.email },
      });
    });
  }

  return (
    <>
      <form className="text-xs lg:text-sm" action={saveAddress}>
        <div className="flex flex-col gap-2">
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
          <div>
            <AddressInput user={user} countryAreaChoices={countryAreaChoices} />
          </div>
          <div>
            <button
              className={clsx('h-[36px] w-1/2 self-end p-2 uppercase text-white lg:w-1/3', {
                hidden: isPending,
                'bg-[hsl(28,30%,59%)] ': !black,
                'bg-black': black,
              })}
              type="submit"
            >
              <div>Guardar</div>
            </button>
            <div
              className={clsx(
                'flex h-[36px] w-1/2 items-center justify-center space-x-3 self-end p-2 tracking-wider text-white lg:w-1/3',
                {
                  hidden: !isPending,
                  'bg-[hsl(28,30%,59%)] ': !black,
                  'bg-black': black,
                },
              )}
            >
              <div className="h-[8px] w-[8px] animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
              <div className="h-[8px] w-[8px] animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
              <div className="h-[8px] w-[8px] animate-bounce rounded-full bg-white"></div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
