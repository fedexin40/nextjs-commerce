'use client';

import { Alert, Snackbar } from '@mui/material';
import clsx from 'clsx';
import { CurrentPerson, countryAreaChoices as countryAreaChoicesType } from 'lib/types';
import { useState, useTransition } from 'react';
import { createAddress, updateAddress } from './actions';

export default function Address({
  user,
  countryAreaChoices,
}: {
  user: CurrentPerson;
  countryAreaChoices: countryAreaChoicesType;
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
      <form className="text-sm" action={saveAddress}>
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
              className="w-full border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider focus:ring-0 focus:ring-offset-0 lg:w-1/2"
              type="text"
              name="firstName"
              placeholder="Nombre..."
              required={true}
              defaultValue={user.firstName}
            />
            <input
              className="hidden border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider focus:ring-0 focus:ring-offset-0 lg:block lg:w-1/2"
              type="text"
              name="lastname"
              placeholder="Apellido..."
              required={true}
              defaultValue={user.lastName}
            />
          </div>
          <input
            className="w-full border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider focus:ring-0 focus:ring-offset-0 lg:hidden"
            type="text"
            name="lastname"
            placeholder="Apellido..."
            required={true}
            defaultValue={user.lastName}
          />
          <input
            className="border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider focus:ring-0 focus:ring-offset-0"
            type="text"
            name="streetAddress1"
            placeholder="Calle y numero de casa..."
            required={true}
            defaultValue={user.address.streetAddress1}
          />
          <div className="flex w-full flex-row gap-x-2">
            <input
              className="w-full border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider focus:ring-0 focus:ring-offset-0 lg:w-1/2"
              type="text"
              name="streetAddress2"
              placeholder="Colonia..."
              required={true}
              defaultValue={user.address.streetAddress2}
            />
            <input
              className="hidden w-1/2 border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider focus:ring-0 focus:ring-offset-0 lg:block"
              type="text"
              name="postalcode"
              placeholder="Codigo postal..."
              required={true}
              defaultValue={user.address.postalCode}
            />
          </div>
          <input
            className="w-full border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider focus:ring-0 focus:ring-offset-0 lg:hidden"
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
          <div className="border-2	border-neutral-300 bg-white px-2 py-1 tracking-wider text-neutral-500 hover:cursor-not-allowed focus:ring-0 focus:ring-offset-0">
            Mexico
          </div>
          <input
            className="border-2	border-neutral-300 bg-white px-2 py-1 tracking-wider text-neutral-500 hover:cursor-not-allowed focus:ring-0 focus:ring-offset-0"
            type="email"
            name="email"
            placeholder="Correo electronico..."
            required={true}
            defaultValue={user.email}
          />
          <div className="flex">
            <button
              className={clsx(
                'self-end pt-2 uppercase text-[hsl(28,30%,59%)] underline decoration-solid decoration-2	underline-offset-4',
                {
                  'cursor-not-allowed opacity-60': isPending,
                },
              )}
              type="submit"
            >
              <div>Guardar</div>
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
