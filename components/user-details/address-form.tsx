'use client';

import { emailCheckoutUpdate, shippingAddressUpdate } from 'actions/shipping';
import { accountRegister } from 'actions/user';
import clsx from 'clsx';
import { Cart, CurrentPerson, countryAreaChoices as countryAreaChoicesType } from 'lib/types';
import Form from 'next/form';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useUser, useUserDetailsActions } from 'stores/user';

export default function AddressInput({
  cart,
  user,
  countryAreaChoices,
}: {
  cart?: Cart;
  user: CurrentPerson;
  countryAreaChoices: countryAreaChoicesType;
}) {
  const userStore = useUser();
  const { setUserDetails } = useUserDetailsActions();
  const [isPending, startTransition] = useTransition();
  const [ErrorMessage, setErrorMessage] = useState('');
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  function resetUserDetails() {
    setUserDetails({
      firstName: cart?.shippingAddress?.firstName || user.firstName || '',
      lastName: cart?.shippingAddress?.lastName || user.lastName || '',
      streetAddress1: cart?.shippingAddress?.streetAddress1 || user.address.streetAddress1,
      streetAddress2: cart?.shippingAddress?.streetAddress2 || user.address.streetAddress2 || '',
      city: cart?.shippingAddress?.city || user.address.city || '',
      email: cart?.userEmail || user.email || '',
      phone: cart?.shippingAddress?.phone || user.address.phone || '',
      postalCode: cart?.shippingAddress?.postalCode || user.address.postalCode || '',
      countryArea: cart?.shippingAddress?.countryArea || user.address.countryArea || '',
    });
  }

  useEffect(() => {
    setErrorMessage('');
    resetUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckbox = () => {
    setChecked(!checked);
  };

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) {
    setUserDetails({ ...userStore, [event.target.name]: event.target.value });
  }

  function setupShippingAddress() {
    startTransition(async () => {
      let error: string;
      if (!cart?.id) {
        return;
      }
      const input = {
        checkoutId: cart?.id,
        streetAddress1: userStore.streetAddress1,
        streetAddress2: userStore.streetAddress2,
        city: userStore.city,
        postalCode: userStore.postalCode,
        countryArea: userStore.countryArea,
        firstName: userStore.firstName,
        lastName: userStore.lastName,
        phone: userStore.phone,
      };
      error = await shippingAddressUpdate(input);
      if (error) {
        startTransition(() => {
          resetUserDetails();
          setErrorMessage(error);
        });
        return;
      }
      if (!cart.userEmail) {
        error = await emailCheckoutUpdate({ checkout: cart.id, email: userStore.email });
        if (error) {
          startTransition(() => {
            setErrorMessage(error);
          });
          return;
        }
      }
      if (checked) {
        error = await accountRegister({
          email: userStore.email,
          password: userStore.password || '',
        });
        if (error) {
          startTransition(() => {
            setErrorMessage(error);
          });
          return;
        }
      }
      router.push(cart?.checkoutCarrier || '');
    });
  }

  return (
    <div className="text-[15px]">
      <Form action={setupShippingAddress}>
        {!user?.id && (
          <div>
            <input
              className="mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2"
              type="email"
              name="email"
              placeholder="Correo electronico..."
              required={true}
              defaultValue={cart?.userEmail || user.email}
              onChange={handleChange}
              disabled={isPending}
            />
            <div className="pb-3">
              <input
                type="checkbox"
                name="createUser"
                checked={checked}
                disabled={isPending}
                onChange={handleCheckbox}
              />
              <label className="pl-3 text-sm italic">¿Quieres crear un usuario?</label>
            </div>
            <input
              className="mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2"
              type="password"
              name="password"
              placeholder="Contraseña..."
              required={checked}
              onChange={handleChange}
              disabled={isPending}
              hidden={!checked}
            />
          </div>
        )}
        <div className="mb-3 flex w-full flex-col gap-3 lg:flex-row">
          <input
            className="w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2 lg:w-1/2"
            type="text"
            name="firstName"
            placeholder="Nombre..."
            required={true}
            defaultValue={cart?.shippingAddress?.firstName || user.firstName}
            onChange={handleChange}
            disabled={isPending}
          />
          <input
            className="rounded-lg border-2 border-neutral-300 bg-white px-2 py-2 lg:w-1/2"
            type="text"
            name="lastName"
            placeholder="Apellido..."
            required={true}
            defaultValue={cart?.shippingAddress?.lastName || user.lastName}
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
          defaultValue={cart?.shippingAddress?.streetAddress1 || user.address.streetAddress1}
          onChange={handleChange}
          disabled={isPending}
        />
        <input
          className="mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2"
          type="text"
          name="streetAddress2"
          placeholder="Colonia..."
          required={true}
          defaultValue={cart?.shippingAddress?.streetAddress2 || user.address.streetAddress2}
          onChange={handleChange}
          disabled={isPending}
        />
        <input
          className="mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2"
          type="number"
          name="postalCode"
          placeholder="Codigo postal..."
          required={true}
          defaultValue={cart?.shippingAddress?.postalCode || user.address.postalCode}
          onChange={handleChange}
          disabled={isPending}
        />
        <input
          className="mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2"
          type="text"
          name="city"
          placeholder="Ciudad..."
          required={true}
          defaultValue={cart?.shippingAddress?.city || user.address.city}
          onChange={handleChange}
          disabled={isPending}
        />
        <select
          onChange={handleChange}
          name="countryArea"
          required={true}
          defaultValue={cart?.shippingAddress?.countryArea || user.address.countryArea}
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
          defaultValue={cart?.shippingAddress?.phone || user.address.phone}
          onChange={handleChange}
          disabled={isPending}
        />
        {user?.id && (
          <div className="rounded-lg	border-2 border-neutral-300 bg-white p-2 hover:cursor-not-allowed">
            {user.email ? user.email : 'Correo electronico...'}
          </div>
        )}
        <div className="flex flex-row gap-3 pt-5">
          <input type="checkbox" />
          <div className="text-[10px] md:text-xs">
            Enviarme novedades y ofertas por correo electronico
          </div>
        </div>
        <div className="pt-5 text-[10px] md:text-xs">Tiempo de entrega: 2 a 7 dias habiles</div>
        <div className="pt-5 text-[10px] md:text-xs">Terminos y condiciones</div>
        <div className="w-full pt-10 md:w-1/2">
          <button className="w-full" type="submit">
            <div
              className={clsx(
                'flex h-[60px] w-full cursor-pointer items-center justify-center whitespace-nowrap bg-black p-3 font-semibold uppercase text-white hover:opacity-50',
                { hidden: isPending },
              )}
            >
              Siguiente
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
      {ErrorMessage && <div className="payment-message pt-5">{ErrorMessage}</div>}
    </div>
  );
}
