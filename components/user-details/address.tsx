'use client';

import { Alert, Snackbar } from '@mui/material';
import { updateAddress } from 'actions/user';
import clsx from 'clsx';
import { CurrentPerson, countryAreaChoices as countryAreaChoicesType } from 'lib/types';
import Form from 'next/form';
import { useState, useTransition } from 'react';
import { useUser, useUserDetailsActions } from 'stores/user';

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
  const { setUserDetails } = useUserDetailsActions();
  const closeError = () => setError(false);
  const openError = () => setError(true);
  const userStore = useUser();

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) {
    setUserDetails({ ...userStore, [event.target.name]: event.target.value });
  }

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
      // Update the address if the user already has one
      const errors = await updateAddress(input);
      if (errors) {
        startTransition(() => {
          openError();
          setErrorMessage(errors);
        });
      }
    });
  }

  return (
    <>
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
          <Form action={saveAddress}>
            <div className="mb-3 flex w-full flex-col gap-3 lg:flex-row">
              <input
                className="w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2 lg:w-1/2"
                type="text"
                name="firstName"
                placeholder="Nombre..."
                required={true}
                defaultValue={user.firstName}
                onChange={handleChange}
                disabled={isPending}
              />
              <input
                className="rounded-lg border-2 border-neutral-300 bg-white px-2 py-2 lg:w-1/2"
                type="text"
                name="lastName"
                placeholder="Apellido..."
                required={true}
                defaultValue={user.lastName}
                onChange={handleChange}
                disabled={isPending}
              />
            </div>
            <input
              className="mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2"
              type="text"
              name="streetAddress1"
              placeholder="Calle y numero de casa..."
              required={true}
              defaultValue={user.address.streetAddress1}
              onChange={handleChange}
              disabled={isPending}
            />
            <input
              className="mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2"
              type="text"
              name="streetAddress2"
              placeholder="Colonia..."
              required={true}
              defaultValue={user.address.streetAddress2}
              onChange={handleChange}
              disabled={isPending}
            />
            <input
              className="mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2"
              type="text"
              name="postalCode"
              placeholder="Codigo postal..."
              required={true}
              defaultValue={user.address.postalCode}
              onChange={handleChange}
              disabled={isPending}
            />
            <input
              className="mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2"
              type="text"
              name="city"
              placeholder="Ciudad..."
              required={true}
              defaultValue={user.address.city}
              onChange={handleChange}
              disabled={isPending}
            />
            <select
              onChange={handleChange}
              name="countryArea"
              required={true}
              defaultValue={user.address.countryArea}
              className="mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2"
              disabled={isPending}
            >
              {countryAreaChoices?.map(({ raw, verbose }) => (
                <option className="" key={raw} value={raw || ''}>
                  {verbose}
                </option>
              ))}
            </select>
            <div className="mb-3 rounded-lg	border-2 border-neutral-300 bg-white p-2 hover:cursor-not-allowed">
              Mexico
            </div>
            <input
              className="mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2"
              type="tel"
              name="phone"
              placeholder="Telefono..."
              required={true}
              defaultValue={user.address.phone}
              onChange={handleChange}
              disabled={isPending}
            />
            {user?.id && (
              <div className="rounded-lg	border-2 border-neutral-300 bg-white p-2 hover:cursor-not-allowed">
                {user.email ? user.email : 'Correo electronico...'}
              </div>
            )}
            <div className="w-full pt-10 md:w-1/2">
              <button className="w-full" type="submit">
                <div
                  className={clsx(
                    'flex h-[60px] w-full cursor-pointer items-center justify-center whitespace-nowrap bg-black p-3 font-semibold uppercase text-white hover:opacity-50',
                    { hidden: isPending },
                  )}
                >
                  Guardar
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
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
