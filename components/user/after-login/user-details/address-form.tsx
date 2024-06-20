'use client';

import { CurrentPerson, countryAreaChoices as countryAreaChoicesType } from 'lib/types';
import { useEffect } from 'react';
import { useUser, useUserDetailsActions } from '../store';

export default function AddressInput({
  user,
  countryAreaChoices,
}: {
  user: CurrentPerson;
  countryAreaChoices: countryAreaChoicesType;
}) {
  const userStore = useUser();
  const { setUserDetails } = useUserDetailsActions();

  useEffect(() => {
    setUserDetails({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      streetAddress1: user.address.streetAddress1,
      streetAddress2: user.address.streetAddress2 || '',
      city: user.address.city || '',
      email: user.email || '',
      phone: user.address.phone || '',
      postalCode: user.address.postalCode || '',
      countryArea: user.address.cityArea || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) {
    setUserDetails({ ...userStore, [event.target.name]: event.target.value });
  }

  return (
    <div className="flex flex-col gap-2 text-xs tracking-wider lg:text-sm">
      <div className="flex w-full flex-col gap-y-2 lg:flex-row lg:gap-x-2">
        <input
          className="w-full border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider dark:border dark:border-[#c9aa9e] dark:bg-zinc-700 lg:w-1/2"
          type="text"
          name="firstName"
          placeholder="Nombre..."
          required={true}
          defaultValue={user.firstName}
          onChange={handleChange}
        />
        <input
          className="border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider dark:border dark:border-[#c9aa9e] dark:bg-zinc-700 lg:block lg:w-1/2"
          type="text"
          name="lastName"
          placeholder="Apellido..."
          required={true}
          defaultValue={user.lastName}
          onChange={handleChange}
        />
      </div>
      <input
        className="border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider dark:border dark:border-[#c9aa9e] dark:bg-zinc-700"
        type="text"
        name="streetAddress1"
        placeholder="Calle y numero de casa..."
        required={true}
        defaultValue={user.address.streetAddress1}
        onChange={handleChange}
      />
      <div className="flex w-full flex-col gap-y-2 lg:flex-row lg:gap-x-2">
        <input
          className="w-full border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider dark:border dark:border-[#c9aa9e] dark:bg-zinc-700 lg:w-1/2"
          type="text"
          name="streetAddress2"
          placeholder="Colonia..."
          required={true}
          defaultValue={user.address.streetAddress2}
          onChange={handleChange}
        />
        <input
          className="w-full border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider dark:border dark:border-[#c9aa9e] dark:bg-zinc-700 lg:block lg:w-1/2"
          type="text"
          name="postalCode"
          placeholder="Codigo postal..."
          required={true}
          defaultValue={user.address.postalCode}
          onChange={handleChange}
        />
      </div>
      <input
        className="border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider dark:border dark:border-[#c9aa9e] dark:bg-zinc-700"
        type="text"
        name="city"
        placeholder="Ciudad..."
        required={true}
        defaultValue={user.address.city}
        onChange={handleChange}
      />
      <select
        onChange={handleChange}
        name="countryArea"
        required={true}
        defaultValue={user.address.countryArea}
        className="border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider dark:border dark:border-[#c9aa9e] dark:bg-zinc-700"
      >
        {countryAreaChoices?.map(({ raw, verbose }) => (
          <option className="tracking-wider" key={raw} value={raw || ''}>
            {verbose}
          </option>
        ))}
      </select>
      <div className="border-2	border-neutral-300 bg-white px-2 py-1 tracking-wider text-neutral-500 hover:cursor-not-allowed dark:border dark:border-[#c9aa9e] dark:bg-zinc-700">
        Mexico
      </div>
      <input
        className="border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider dark:border dark:border-[#c9aa9e] dark:bg-zinc-700"
        type="tel"
        name="phone"
        placeholder="Telefono..."
        required={true}
        defaultValue={user.address.phone}
        onChange={handleChange}
      />
      <div className="h-[26px] border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider text-neutral-500 hover:cursor-not-allowed dark:border dark:border-[#c9aa9e] dark:bg-zinc-700 lg:h-[32px]">
        {user.email ? user.email : 'Correo electronico...'}
      </div>
    </div>
  );
}
