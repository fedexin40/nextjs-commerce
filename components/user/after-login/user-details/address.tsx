'use client';

import { Alert, Snackbar } from '@mui/material';
import clsx from 'clsx';
import { CurrentPerson, countryAreaChoices as countryAreaChoicesType } from 'lib/types';
import { useState, useTransition } from 'react';
import { createAddress, updateAddress } from './actions';

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
          <div className="flex w-full flex-row gap-x-2">
            <input
              className="w-full border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider lg:w-1/2"
              type="text"
              name="firstName"
              placeholder="Nombre..."
              required={true}
              defaultValue={user.firstName}
            />
            <input
              className="hidden border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider lg:block lg:w-1/2"
              type="text"
              name="lastname"
              placeholder="Apellido..."
              required={true}
              defaultValue={user.lastName}
            />
          </div>
          <input
            className="w-full border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider lg:hidden"
            type="text"
            name="lastname"
            placeholder="Apellido..."
            required={true}
            defaultValue={user.lastName}
          />
          <input
            className="border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider"
            type="text"
            name="streetAddress1"
            placeholder="Calle y numero de casa..."
            required={true}
            defaultValue={user.address.streetAddress1}
          />
          <div className="flex w-full flex-row gap-x-2">
            <input
              className="w-full border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider lg:w-1/2"
              type="text"
              name="streetAddress2"
              placeholder="Colonia..."
              required={true}
              defaultValue={user.address.streetAddress2}
            />
            <input
              className="hidden w-1/2 border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider lg:block"
              type="text"
              name="postalcode"
              placeholder="Codigo postal..."
              required={true}
              defaultValue={user.address.postalCode}
            />
          </div>
          <input
            className="w-full border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider lg:hidden"
            type="text"
            name="postalcode"
            placeholder="Codigo postal..."
            required={true}
            defaultValue={user.address.postalCode}
          />
          <input
            className="border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider"
            type="text"
            name="city"
            placeholder="Ciudad..."
            required={true}
            defaultValue={user.address.city}
          />
          <select
            name="countryAreaChoice"
            required={true}
            defaultValue={user.address.countryArea}
            className="border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider"
          >
            {countryAreaChoices?.map(({ raw, verbose }) => (
              <option className="tracking-wider" key={raw} value={raw || ''}>
                {verbose}
              </option>
            ))}
          </select>
          <div className="border-2	border-neutral-300 bg-white px-2 py-1 tracking-wider text-neutral-500 hover:cursor-not-allowed">
            Mexico
          </div>
          <input
            className="border-2	border-neutral-300 bg-white px-2 py-1 tracking-wider text-neutral-500 hover:cursor-not-allowed"
            type="email"
            name="email"
            placeholder="Correo electronico..."
            required={true}
            defaultValue={user.email}
          />
          <div>
            <button
              className={clsx('h-[36px] w-1/3 self-end p-2 uppercase text-white', {
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
                'flex h-[36px] w-1/3 items-center justify-center space-x-3 self-end p-2 tracking-wider text-white',
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
